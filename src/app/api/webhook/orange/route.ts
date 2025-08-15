import { NextRequest, NextResponse } from "next/server";
import { handleWebhook, WebhookPayload } from "@/lib/payment-apis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Orange Money webhook payload structure
    const webhookPayload: WebhookPayload = {
      transactionId: body.pay_token || body.transaction_id,
      status: body.status === "SUCCESS" ? "success" : "failed",
      amount: parseFloat(body.amount),
      phoneNumber: body.phone_number,
      reference: body.order_id,
      timestamp: new Date().toISOString(),
      provider: "orange",
      errorMessage: body.status !== "SUCCESS" ? body.message : undefined,
    };

    // Process the webhook
    handleWebhook(webhookPayload);

    // Log for debugging
    console.log("Orange Money webhook received:", webhookPayload);

    return NextResponse.json({
      status: "success",
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("Orange Money webhook error:", error);
    return NextResponse.json(
      { status: "error", message: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
