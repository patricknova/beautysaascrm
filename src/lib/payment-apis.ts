import axios from "axios";

// Types for payment requests and responses
export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  reference: string;
  description: string;
  callbackUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  status: "pending" | "success" | "failed";
}

export interface WebhookPayload {
  transactionId: string;
  status: "success" | "failed";
  amount: number;
  phoneNumber: string;
  reference: string;
  timestamp: string;
  provider: "orange" | "mtn";
  errorMessage?: string;
}

// Orange Money API Integration
export class OrangeMoneyAPI {
  private baseUrl = "https://api.orange.com/orange-money-webpay/cm/v1";
  private accessToken: string | null = null;
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/oauth/token`,
        {
          grant_type: "client_credentials",
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!this.accessToken) 
        {
        throw new Error("Orange Money API returned null or empty access token");
        }
      return this.accessToken;
    } catch (error) {
      console.error("Error getting Orange Money access token:", error);
      throw new Error("Failed to authenticate with Orange Money API");
    }
  }

  async initiatePayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/webpayment`,
        {
          merchant_key: this.clientId,
          currency: "XAF",
          order_id: paymentRequest.reference,
          amount: paymentRequest.amount,
          return_url: paymentRequest.callbackUrl,
          cancel_url: paymentRequest.callbackUrl,
          notif_url: `${paymentRequest.callbackUrl}/webhook/orange`,
          lang: "fr",
          reference: paymentRequest.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.status === "SUCCESS") {
        return {
          success: true,
          transactionId: response.data.pay_token,
          message: "Payment initiated successfully",
          status: "pending",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Payment initiation failed",
          status: "failed",
        };
      }
    } catch (error: any) {
      console.error("Orange Money payment error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Payment failed",
        status: "failed",
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/webpayment/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const status = response.data.status;
      return {
        success: status === "SUCCESS",
        transactionId,
        message: response.data.message || "Status retrieved",
        status:
          status === "SUCCESS"
            ? "success"
            : status === "FAILED"
              ? "failed"
              : "pending",
      };
    } catch (error: any) {
      console.error("Orange Money status check error:", error);
      return {
        success: false,
        message: "Failed to check payment status",
        status: "failed",
      };
    }
  }
}

// MTN Money API Integration
export class MTNMoneyAPI {
  private baseUrl = "https://sandbox.momodeveloper.mtn.com";
  private subscriptionKey: string;
  private userId: string;
  private apiKey: string;
  private accessToken: string | null = null;

  constructor(subscriptionKey: string, userId: string, apiKey: string) {
    this.subscriptionKey = subscriptionKey;
    this.userId = userId;
    this.apiKey = apiKey;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/collection/token/`,
        {},
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.userId}:${this.apiKey}`).toString("base64")}`,
            "Ocp-Apim-Subscription-Key": this.subscriptionKey,
          },
        },
      );

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error("Error getting MTN Money access token:", error);
      throw new Error("Failed to authenticate with MTN Money API");
    }
  }

  async initiatePayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      const token = await this.getAccessToken();
      const transactionId = `mtn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await axios.post(
        `${this.baseUrl}/collection/v1_0/requesttopay`,
        {
          amount: paymentRequest.amount.toString(),
          currency: "XAF",
          externalId: paymentRequest.reference,
          payer: {
            partyIdType: "MSISDN",
            partyId: paymentRequest.phoneNumber.replace("+237", ""),
          },
          payerMessage: paymentRequest.description,
          payeeNote: paymentRequest.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Reference-Id": transactionId,
            "X-Target-Environment": "sandbox",
            "Ocp-Apim-Subscription-Key": this.subscriptionKey,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 202) {
        return {
          success: true,
          transactionId,
          message: "Payment initiated successfully",
          status: "pending",
        };
      } else {
        return {
          success: false,
          message: "Payment initiation failed",
          status: "failed",
        };
      }
    } catch (error: any) {
      console.error("MTN Money payment error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Payment failed",
        status: "failed",
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/collection/v1_0/requesttopay/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Target-Environment": "sandbox",
            "Ocp-Apim-Subscription-Key": this.subscriptionKey,
          },
        },
      );

      const status = response.data.status;
      return {
        success: status === "SUCCESSFUL",
        transactionId,
        message: response.data.reason || "Status retrieved",
        status:
          status === "SUCCESSFUL"
            ? "success"
            : status === "FAILED"
              ? "failed"
              : "pending",
      };
    } catch (error: any) {
      console.error("MTN Money status check error:", error);
      return {
        success: false,
        message: "Failed to check payment status",
        status: "failed",
      };
    }
  }
}

// Payment Manager to handle both providers
export class PaymentManager {
  private orangeAPI: OrangeMoneyAPI;
  private mtnAPI: MTNMoneyAPI;

  constructor() {
    // Initialize with environment variables or default test credentials
    this.orangeAPI = new OrangeMoneyAPI(
      process.env.ORANGE_CLIENT_ID || "test_client_id",
      process.env.ORANGE_CLIENT_SECRET || "test_client_secret",
    );

    this.mtnAPI = new MTNMoneyAPI(
      process.env.MTN_SUBSCRIPTION_KEY || "test_subscription_key",
      process.env.MTN_USER_ID || "test_user_id",
      process.env.MTN_API_KEY || "test_api_key",
    );
  }

  async processPayment(
    provider: "orange" | "mtn",
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      if (provider === "orange") {
        return await this.orangeAPI.initiatePayment(paymentRequest);
      } else {
        return await this.mtnAPI.initiatePayment(paymentRequest);
      }
    } catch (error) {
      console.error(`Payment processing error for ${provider}:`, error);
      return {
        success: false,
        message: "Payment processing failed",
        status: "failed",
      };
    }
  }

  async checkStatus(
    provider: "orange" | "mtn",
    transactionId: string,
  ): Promise<PaymentResponse> {
    try {
      if (provider === "orange") {
        return await this.orangeAPI.checkPaymentStatus(transactionId);
      } else {
        return await this.mtnAPI.checkPaymentStatus(transactionId);
      }
    } catch (error) {
      console.error(`Status check error for ${provider}:`, error);
      return {
        success: false,
        message: "Status check failed",
        status: "failed",
      };
    }
  }
}

// Webhook handler
export const handleWebhook = (payload: WebhookPayload) => {
  // Store the webhook data in localStorage for demo purposes
  // In a real application, this would be handled by a backend service
  const webhooks = JSON.parse(localStorage.getItem("payment_webhooks") || "[]");
  webhooks.push({
    ...payload,
    receivedAt: new Date().toISOString(),
  });
  localStorage.setItem("payment_webhooks", JSON.stringify(webhooks));

  // Trigger custom event for real-time updates
  window.dispatchEvent(new CustomEvent("paymentWebhook", { detail: payload }));
};

// Get payment status from webhooks
export const getPaymentStatusFromWebhook = (
  transactionId: string,
): WebhookPayload | null => {
  const webhooks = JSON.parse(localStorage.getItem("payment_webhooks") || "[]");
  return (
    webhooks.find(
      (webhook: WebhookPayload) => webhook.transactionId === transactionId,
    ) || null
  );
};
