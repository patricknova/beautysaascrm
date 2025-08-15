import { NextRequest, NextResponse } from "next/server";
import { handleWebhook, WebhookPayload } from "@/lib/payment-apis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // MTN Money webhook payload structure
    const webhookPayload: WebhookPayload = {
      transactionId: body.referenceId || body.transaction_id,
      status: body.status === "SUCCESSFUL" ? "success" : "failed",
      amount: parseFloat(body.amount),
      phoneNumber: body.payer?.partyId || body.phone_number,
      reference: body.externalId,
      timestamp: new Date().toISOString(),
      provider: "mtn",
      errorMessage: body.status !== "SUCCESSFUL" ? body.reason : undefined,
    };

    // Process the webhook
    handleWebhook(webhookPayload);

    // Log for debugging
    console.log("MTN Money webhook received:", webhookPayload);

    return NextResponse.json({
      status: "success",
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("MTN Money webhook error:", error);
    return NextResponse.json(
      { status: "error", message: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
