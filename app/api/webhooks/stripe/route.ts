import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { triggerProjectProcessing } from "@/lib/actions/images";
import {
  handleStripePaymentFailure,
  handleStripePaymentSuccess,
} from "@/lib/actions/payments";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[webhook/stripe] Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(
      "[webhook/stripe] Webhook signature verification failed:",
      err
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[webhook/stripe] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid") {
          // Handle successful payment
          const result = await handleStripePaymentSuccess(
            session.id,
            session.payment_intent as string
          );

          if (result.success) {
            // Trigger image processing for the project
            await triggerProjectProcessing(result.data.projectId);
            console.log(
              `[webhook/stripe] Payment successful, processing triggered for project: ${result.data.projectId}`
            );
          } else {
            console.error(
              `[webhook/stripe] Failed to handle payment success: ${result.error}`
            );
          }
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Handle expired checkout
        const result = await handleStripePaymentFailure(session.id);

        if (result.success) {
          console.log(
            `[webhook/stripe] Checkout expired for project: ${result.data.projectId}`
          );
        } else {
          console.error(
            `[webhook/stripe] Failed to handle checkout expiration: ${result.error}`
          );
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Check if this is an off-session payment (has projectId in metadata)
        if (paymentIntent.metadata?.projectId) {
          console.log(
            `[webhook/stripe] Off-session payment succeeded for project: ${paymentIntent.metadata.projectId}`
          );
          // Note: Processing is already triggered in chargeWithSavedPaymentMethod
          // This webhook is a backup/confirmation
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          `[webhook/stripe] Payment failed for payment intent: ${paymentIntent.id}`
        );
        // Payment failures are typically handled at the checkout level
        // This event is for additional logging/alerting
        break;
      }

      default:
        console.log(`[webhook/stripe] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      `[webhook/stripe] Error processing event ${event.type}:`,
      error
    );
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
