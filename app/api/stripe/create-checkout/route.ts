import { type NextRequest, NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/actions/payments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const result = await createStripeCheckoutSession(projectId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      url: result.data.url,
      sessionId: result.data.sessionId,
    });
  } catch (error) {
    console.error("[api/stripe/create-checkout] Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
