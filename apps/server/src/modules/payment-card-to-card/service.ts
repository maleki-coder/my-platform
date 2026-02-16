import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import {
  Logger,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types";

type Options = {
  instructions: string; // e.g., bank details
};

type InjectedDependencies = {
  logger: Logger;
};

class CardToCardProviderService extends AbstractPaymentProvider<Options> {
  protected logger_: Logger;
  protected options_: Options;

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options);
    this.logger_ = container.logger;
    this.options_ = options;
  }

  static identifier = "card-to-card";

  async initiatePayment(input): Promise<any> {
    // Return session data with instructions; no real integration
    return {
      data: {
        instructions:
          this.options_.instructions ||
          "Transfer to card 1234-5678-9012-3456 and upload receipt after order placement.",
      },
      status: "pending",
    };
  }

  async authorizePayment(input): Promise<any> {
    // Mark as authorized but pending manual capture
    return {
      data: input.data,
      status: "authorized", // Allows order placement; capture later in admin
    };
  }

  async capturePayment(input): Promise<any> {
    // Manual capture: Just update status (no external call)
    this.logger_.info(`Manually capturing payment for ${input.data.id}`);
    return {
      data: input.data,
      status: "captured",
    };
  }

  async refundPayment(input): Promise<any> {
    // Manual refund: Update status
    this.logger_.info(
      `Manually refunding ${input.amount} for ${input.data.id}`,
    );
    return {
      data: input.data,
      status: "refunded",
    };
  }

  async cancelPayment(input): Promise<any> {
    // Cancel if not captured
    return {
      data: input.data,
      status: "canceled",
    };
  }

  async getPaymentStatus(input): Promise<any> {
    // Assume pending until captured
    return { status: "authorized" }; // Or check metadata if needed
  }

  // Minimal implementations for other methods (throw or no-op as needed)
  async deletePayment(input): Promise<any> {
    return { data: input.data };
  }

  async retrievePayment(input): Promise<any> {
    return input.data;
  }

  async updatePayment(input): Promise<any> {
    return input.data;
  }
  getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"],
  ): Promise<WebhookActionResult> {
    throw new Error("Method not implemented.");
  }
}

export default CardToCardProviderService;
