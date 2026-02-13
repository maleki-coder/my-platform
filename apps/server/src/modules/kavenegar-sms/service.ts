import {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types";
import { AbstractNotificationProviderService } from "@medusajs/framework/utils";
const Kavenegar = require("kavenegar");
type InjectedDependencies = {};

type KavenegarSmsOptions = {
  apikey: string;
  from: string;
};

class KavenegarSmsService extends AbstractNotificationProviderService {
  static readonly identifier = "kavenegar-sms";
  private readonly from: string;
  public client: any;
  constructor(container: InjectedDependencies, options: KavenegarSmsOptions) {
    super();

    this.client = Kavenegar.KavenegarApi({
      apikey: options.apikey,
    });
    this.from = options.from;
  }
  static validateOptions(options: KavenegarSmsOptions): void | never {
    if (!options.apikey) {
      throw new Error("api is required");
    }
    if (!options.from) {
      throw new Error("From is required");
    }
  }
  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    // Destructure the required information from the notification object
    const { to, channel, data } = notification;

    // Ensure the notification is for the SMS channel
    if (channel !== "sms") {
      throw new Error(`Unsupported channel: ${channel}`);
    }

    // Extract message content and recipient phone number from data
    // Fallback for 'to' ensures compatibility
    const message = data?.message || data?.body;
    const receptor = data?.receptor || to;
    const otp = data?.otp;
    if (!otp) {
      throw new Error("An OTP is required");
    }
    // Validate that required fields are present
    if (!message) {
      throw new Error("A 'message' is required in the notification data.");
    }
    if (!receptor) {
      throw new Error("A recipient ('to') is required.");
    }
    const finalMessage = String(message) + String(otp);

    // Wrap the Kavenegar callback-based API in a Promise
    return new Promise((resolve, reject) => {
      this.client.VerifyLookup(
        {
          token: String(otp), // Your sender number from options
          receptor: receptor, // The recipient's phone number
          template: "test", // The text message to send
        },
        (response: any, status: number) => {
          // Handle the API response
          if (status === 200) {
            // Success: Resolve with the result expected by Medusa
            resolve({
              id: response.messageid?.toString() || `${Date.now()}`,
            });
          } else {
            // Error: Reject with a descriptive message
            reject(
              new Error(`Kavenegar API error (Status: ${status}).
                    Response: ${JSON.stringify(response)}`)
            );
          }
        }
      );
    });
  }
}

export default KavenegarSmsService;
