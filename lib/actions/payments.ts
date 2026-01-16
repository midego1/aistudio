"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProjectById, getWorkspaceById } from "@/lib/db/queries";
import {
  type PaymentMethod,
  type PaymentStatus,
  project,
  projectPayment,
  user,
  stripeCustomer,
  workspace,
} from "@/lib/db/schema";
import { getBaseUrl, STRIPE_CONFIG, stripe } from "@/lib/stripe";
import { createProjectInvoiceLineItemAction } from "./billing";

// ============================================================================
// Types
// ============================================================================

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// Stripe Customer Functions
// ============================================================================

/**
 * Get or create a Stripe customer for a workspace
 */
export async function getOrCreateStripeCustomer(
  workspaceId: string
): Promise<ActionResult<{ stripeCustomerId: string }>> {
  try {
    // Check if we already have a Stripe customer
    const existing = await db.query.stripeCustomer.findFirst({
      where: eq(stripeCustomer.workspaceId, workspaceId),
    });

    if (existing) {
      return {
        success: true,
        data: { stripeCustomerId: existing.stripeCustomerId },
      };
    }

    // Get workspace details
    const workspaceData = await getWorkspaceById(workspaceId);
    if (!workspaceData) {
      return { success: false, error: "Workspace not found" };
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      name: workspaceData.name,
      email: workspaceData.contactEmail || undefined,
      metadata: {
        workspaceId,
        organizationNumber: workspaceData.organizationNumber || "",
      },
    });

    // Save to database
    await db.insert(stripeCustomer).values({
      id: nanoid(),
      workspaceId,
      stripeCustomerId: customer.id,
    });

    return { success: true, data: { stripeCustomerId: customer.id } };
  } catch (error) {
    console.error("[payments:getOrCreateStripeCustomer] Error:", error);
    return { success: false, error: "Failed to create Stripe customer" };
  }
}

// ============================================================================
// Invoice Eligibility Functions
// ============================================================================

/**
 * Check if a workspace can use invoice billing
 * Requirements: has organization number + marked as invoice eligible by admin
 */
export async function canUseInvoiceBilling(
  workspaceId: string
): Promise<{ eligible: boolean; reason?: string }> {
  try {
    const workspaceData = await getWorkspaceById(workspaceId);

    if (!workspaceData) {
      return { eligible: false, reason: "Workspace not found" };
    }

    // Must have organization number (Norwegian business)
    if (!workspaceData.organizationNumber) {
      return { eligible: false, reason: "No organization number" };
    }

    // Must be marked as invoice eligible
    if (!workspaceData.invoiceEligible) {
      return { eligible: false, reason: "Not approved for invoicing" };
    }

    return { eligible: true };
  } catch (error) {
    console.error("[payments:canUseInvoiceBilling] Error:", error);
    return { eligible: false, reason: "Failed to check eligibility" };
  }
}

// ============================================================================
// Project Payment Functions
// ============================================================================

/**
 * Get payment status for a project
 */
export async function getProjectPaymentStatus(projectId: string): Promise<{
  isPaid: boolean;
  method?: PaymentMethod;
  status?: PaymentStatus;
}> {
  try {
    // Bypass payment in development
    if (process.env.NODE_ENV === "development") {
      return { isPaid: true, status: "completed", method: "free" };
    }

    const payment = await db.query.projectPayment.findFirst({
      where: eq(projectPayment.projectId, projectId),
    });

    if (!payment) {
      return { isPaid: false };
    }

    return {
      isPaid: payment.status === "completed",
      method: payment.paymentMethod as PaymentMethod,
      status: payment.status as PaymentStatus,
    };
  } catch (error) {
    console.error("[payments:getProjectPaymentStatus] Error:", error);
    return { isPaid: false };
  }
}

/**
 * Create a Stripe checkout session for a project
 */
export async function createStripeCheckoutSession(
  projectId: string
): Promise<ActionResult<{ url: string; sessionId: string }>> {
  try {
    // Get session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get project
    const projectData = await getProjectById(projectId);
    if (!projectData) {
      return { success: false, error: "Project not found" };
    }

    // Check if already paid
    const existingPayment = await db.query.projectPayment.findFirst({
      where: eq(projectPayment.projectId, projectId),
    });

    if (existingPayment?.status === "completed") {
      return { success: false, error: "Project already paid" };
    }

    // Get or create Stripe customer
    const customerResult = await getOrCreateStripeCustomer(
      projectData.project.workspaceId
    );
    if (!customerResult.success) {
      return customerResult;
    }

    const baseUrl = getBaseUrl();

    // Create checkout session with setup_future_usage to save card
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerResult.data.stripeCustomerId,
      mode: "payment",
      payment_intent_data: {
        setup_future_usage: "off_session", // Save card for future payments
      },
      line_items: [
        {
          price: STRIPE_CONFIG.PRICE_PROJECT_EUR,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard/${projectId}?payment=success`,
      cancel_url: `${baseUrl}/dashboard/${projectId}?payment=cancelled`,
      metadata: {
        projectId,
        workspaceId: projectData.project.workspaceId,
        userId: session.user.id,
      },
    });

    // Create or update payment record
    if (existingPayment) {
      await db
        .update(projectPayment)
        .set({
          stripeCheckoutSessionId: checkoutSession.id,
          status: "pending",
          updatedAt: new Date(),
        })
        .where(eq(projectPayment.id, existingPayment.id));
    } else {
      await db.insert(projectPayment).values({
        id: nanoid(),
        projectId,
        workspaceId: projectData.project.workspaceId,
        paymentMethod: "stripe",
        stripeCheckoutSessionId: checkoutSession.id,
        amountCents: STRIPE_CONFIG.PROJECT_PRICE_EUR_CENTS,
        currency: "usd",
        status: "pending",
      });
    }

    return {
      success: true,
      data: {
        url: checkoutSession.url!,
        sessionId: checkoutSession.id,
      },
    };
  } catch (error) {
    console.error("[payments:createStripeCheckoutSession] Error:", error);
    return { success: false, error: "Failed to create checkout session" };
  }
}

/**
 * Create invoice payment for eligible workspace
 * This creates a line item and marks the project as paid immediately
 */
export async function createInvoicePayment(
  projectId: string
): Promise<ActionResult<{ paymentId: string }>> {
  try {
    // Get session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get project
    const projectData = await getProjectById(projectId);
    if (!projectData) {
      return { success: false, error: "Project not found" };
    }

    // Check if workspace is invoice eligible
    const eligibility = await canUseInvoiceBilling(
      projectData.project.workspaceId
    );
    if (!eligibility.eligible) {
      return {
        success: false,
        error: eligibility.reason || "Not eligible for invoicing",
      };
    }

    // Check if already paid
    const existingPayment = await db.query.projectPayment.findFirst({
      where: eq(projectPayment.projectId, projectId),
    });

    if (existingPayment?.status === "completed") {
      return { success: false, error: "Project already paid" };
    }

    // Create invoice line item
    const lineItemResult = await createProjectInvoiceLineItemAction(
      projectData.project.workspaceId,
      projectId,
      projectData.project.name
    );

    if (!lineItemResult.success) {
      return { success: false, error: lineItemResult.error };
    }

    // Create payment record (marked as completed for invoice customers)
    const paymentId = nanoid();
    await db.insert(projectPayment).values({
      id: paymentId,
      projectId,
      workspaceId: projectData.project.workspaceId,
      paymentMethod: "invoice",
      invoiceLineItemId: lineItemResult.data.id,
      amountCents: STRIPE_CONFIG.PROJECT_PRICE_EUR_CENTS,
      currency: "usd",
      status: "completed", // Invoice customers pay later, but can process immediately
      paidAt: new Date(),
    });

    revalidatePath(`/dashboard/${projectId}`);
    return { success: true, data: { paymentId } };
  } catch (error) {
    console.error("[payments:createInvoicePayment] Error:", error);
    return { success: false, error: "Failed to create invoice payment" };
  }
}

/**
 * Handle successful Stripe payment (called from webhook)
 */
export async function handleStripePaymentSuccess(
  checkoutSessionId: string,
  paymentIntentId: string
): Promise<ActionResult<{ projectId: string }>> {
  try {
    // Find the payment record
    const payment = await db.query.projectPayment.findFirst({
      where: eq(projectPayment.stripeCheckoutSessionId, checkoutSessionId),
    });

    if (!payment) {
      return { success: false, error: "Payment record not found" };
    }

    // Update payment status
    await db
      .update(projectPayment)
      .set({
        status: "completed",
        stripePaymentIntentId: paymentIntentId,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(projectPayment.id, payment.id));

    revalidatePath(`/dashboard/${payment.projectId}`);
    return { success: true, data: { projectId: payment.projectId } };
  } catch (error) {
    console.error("[payments:handleStripePaymentSuccess] Error:", error);
    return { success: false, error: "Failed to handle payment success" };
  }
}

/**
 * Handle failed/expired Stripe checkout (called from webhook)
 */
export async function handleStripePaymentFailure(
  checkoutSessionId: string
): Promise<ActionResult<{ projectId: string }>> {
  try {
    // Find the payment record
    const payment = await db.query.projectPayment.findFirst({
      where: eq(projectPayment.stripeCheckoutSessionId, checkoutSessionId),
    });

    if (!payment) {
      return { success: false, error: "Payment record not found" };
    }

    // Update payment status
    await db
      .update(projectPayment)
      .set({
        status: "failed",
        updatedAt: new Date(),
      })
      .where(eq(projectPayment.id, payment.id));

    revalidatePath(`/dashboard/${payment.projectId}`);
    return { success: true, data: { projectId: payment.projectId } };
  } catch (error) {
    console.error("[payments:handleStripePaymentFailure] Error:", error);
    return { success: false, error: "Failed to handle payment failure" };
  }
}

// ============================================================================
// Admin Functions
// ============================================================================

/**
 * Toggle invoice eligibility for a workspace (admin only)
 */
export async function setWorkspaceInvoiceEligibility(
  workspaceId: string,
  eligible: boolean
): Promise<ActionResult<{ success: boolean }>> {
  try {
    // Get session and verify admin
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user is system admin
    const { verifySystemAdmin } = await import("@/lib/admin-auth");
    const adminCheck = await verifySystemAdmin();
    if (adminCheck.error) {
      return { success: false, error: adminCheck.error };
    }

    // Update workspace
    await db
      .update(workspace)
      .set({
        invoiceEligible: eligible,
        invoiceEligibleAt: eligible ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(workspace.id, workspaceId));

    revalidatePath(`/admin/workspaces/${workspaceId}`);
    return { success: true, data: { success: true } };
  } catch (error) {
    console.error("[payments:setWorkspaceInvoiceEligibility] Error:", error);
    return { success: false, error: "Failed to update invoice eligibility" };
  }
}

// ============================================================================
// Saved Payment Methods Functions
// ============================================================================

export interface SavedPaymentMethod {
  id: string;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
}

/**
 * Get saved payment methods for a workspace
 */
export async function getWorkspacePaymentMethods(
  workspaceId: string
): Promise<ActionResult<{ paymentMethods: SavedPaymentMethod[] }>> {
  try {
    // Get Stripe customer for workspace
    const customerRecord = await db.query.stripeCustomer.findFirst({
      where: eq(stripeCustomer.workspaceId, workspaceId),
    });

    if (!customerRecord) {
      return { success: true, data: { paymentMethods: [] } };
    }

    // List payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerRecord.stripeCustomerId,
      type: "card",
    });

    return {
      success: true,
      data: {
        paymentMethods: paymentMethods.data.map((pm) => ({
          id: pm.id,
          brand: pm.card?.brand || null,
          last4: pm.card?.last4 || null,
          expMonth: pm.card?.exp_month || null,
          expYear: pm.card?.exp_year || null,
        })),
      },
    };
  } catch (error) {
    console.error("[payments:getWorkspacePaymentMethods] Error:", error);
    return { success: false, error: "Failed to get payment methods" };
  }
}

/**
 * Charge a project using a saved payment method (off-session)
 */
export async function chargeWithSavedPaymentMethod(
  projectId: string,
  paymentMethodId: string
): Promise<ActionResult<{ status: string; paymentIntentId: string }>> {
  try {
    // Get session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get project
    const projectData = await getProjectById(projectId);
    if (!projectData) {
      return { success: false, error: "Project not found" };
    }

    // Check if already paid
    const existingPayment = await db.query.projectPayment.findFirst({
      where: eq(projectPayment.projectId, projectId),
    });

    if (existingPayment?.status === "completed") {
      return { success: false, error: "Project already paid" };
    }

    // Get Stripe customer
    const customerRecord = await db.query.stripeCustomer.findFirst({
      where: eq(stripeCustomer.workspaceId, projectData.project.workspaceId),
    });

    if (!customerRecord) {
      return { success: false, error: "No Stripe customer found" };
    }

    // Create PaymentIntent with saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: STRIPE_CONFIG.PROJECT_PRICE_EUR_CENTS,
      currency: "usd",
      customer: customerRecord.stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        projectId,
        workspaceId: projectData.project.workspaceId,
        userId: session.user.id,
      },
    });

    const isSucceeded = paymentIntent.status === "succeeded";

    // Create or update payment record
    if (existingPayment) {
      await db
        .update(projectPayment)
        .set({
          stripePaymentIntentId: paymentIntent.id,
          status: isSucceeded ? "completed" : "pending",
          paidAt: isSucceeded ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(projectPayment.id, existingPayment.id));
    } else {
      await db.insert(projectPayment).values({
        id: nanoid(),
        projectId,
        workspaceId: projectData.project.workspaceId,
        paymentMethod: "stripe",
        stripePaymentIntentId: paymentIntent.id,
        amountCents: STRIPE_CONFIG.PROJECT_PRICE_EUR_CENTS,
        currency: "usd",
        status: isSucceeded ? "completed" : "pending",
        paidAt: isSucceeded ? new Date() : null,
      });
    }

    // If payment succeeded, trigger processing immediately
    if (isSucceeded) {
      const { triggerProjectProcessing } = await import("@/lib/actions/images");
      await triggerProjectProcessing(projectId);
    }

    revalidatePath(`/dashboard/${projectId}`);
    return {
      success: true,
      data: { status: paymentIntent.status, paymentIntentId: paymentIntent.id },
    };
  } catch (error) {
    console.error("[payments:chargeWithSavedPaymentMethod] Error:", error);

    // Handle specific Stripe errors
    if (error instanceof Error && "type" in error) {
      const stripeError = error as { type: string; message: string };
      if (stripeError.type === "StripeCardError") {
        return { success: false, error: stripeError.message };
      }
    }

    return { success: false, error: "Failed to charge payment method" };
  }
}

// ============================================================================
// Billing Portal
// ============================================================================

/**
 * Create a Stripe Billing Portal session for the user's workspace
 * Allows users to manage payment methods and view invoice history
 */
export async function createBillingPortalSession(): Promise<
  ActionResult<{ url: string }>
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user with workspace
    const [currentUser] = await db
      .select({ workspaceId: user.workspaceId })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    
    const workspaceId = currentUser?.workspaceId;
    if (!workspaceId) {
      return { success: false, error: "No workspace found" };
    }

    // Get or create Stripe customer
    const customerResult = await getOrCreateStripeCustomer(workspaceId);
    if (!customerResult.success) {
      return { success: false, error: customerResult.error };
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerResult.data.stripeCustomerId,
      return_url: `${getBaseUrl()}/dashboard/settings`,
    });

    return { success: true, data: { url: portalSession.url } };
  } catch (error) {
    console.error("[payments:createBillingPortalSession] Error:", error);
    return { success: false, error: "Failed to create billing portal session" };
  }
}
