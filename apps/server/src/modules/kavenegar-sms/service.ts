import {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types";
import { AbstractNotificationProviderService } from "@medusajs/framework/utils";
const Kavenegar = require("kavenegar");
type InjectedDependencies = {};

type KavenegarSmsOptions = {
  apikey: string;
  from: string; // your sender number (e.g. 1000xxxxxx or dedicated line)
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
      throw new Error("apikey is required");
    }
    if (!options.from) {
      throw new Error("from is required");
    }
  }

  async send(
    notification: ProviderSendNotificationDTO,
  ): Promise<ProviderSendNotificationResultsDTO> {
    const { to, channel, template, data } = notification;

    if (channel !== "sms") {
      throw new Error(`Unsupported channel: ${channel}`);
    }

    const receptor = data?.receptor || to;
    if (!receptor) {
      throw new Error(
        "Recipient phone number ('to' or data.receptor) is required.",
      );
    }

    // ── OTP / Lookup mode ── (your existing logic, slightly cleaned)
    if (template === "otp-template" && data?.otp) {
      // Assuming you use VerifyLookup for OTPs
      return new Promise((resolve, reject) => {
        this.client.VerifyLookup(
          {
            receptor,
            token: String(data.otp),
            template: template, // e.g. "verify", "login", "test"...
            // token2, token3 if your template needs more
          },
          (response: any, status: number) => {
            if (status === 200) {
              resolve({
                id: response.messageid?.toString() || `${Date.now()}`,
              });
            } else {
              reject(
                new Error(
                  `Kavenegar VerifyLookup error (Status: ${status}). Response: ${JSON.stringify(response)}`,
                ),
              );
            }
          },
        );
      });
    }

    // ── Normal SMS mode (for order notifications) ──
    let message = data?.message || data?.body || data?.text;
    console.log("kavehnegar message : " + message);
    if (!message) {
      throw new Error(
        "Message content is required for normal SMS (data.message / data.body)",
      );
    }

    // Optional: append extra info, format nicely, etc.
    // message = `Your order #${data?.order?.display_id || 'N/A'} - ${message}`;

    return new Promise((resolve, reject) => {
      this.client.Send(
        {
          sender: this.from,
          receptor,
          message: String(message),
          // Optional params you can expose later via data:
          // date: data?.date,   // schedule
          // type: data?.type,
          // localid: data?.localId,
        },
        (response: any, status: number) => {
          if (status === 200) {
            // response is usually an array of send results
            const msgId = response[0]?.messageid || `${Date.now()}`;
            resolve({ id: msgId.toString() });
          } else {
            reject(
              new Error(
                `Kavenegar Send error (Status: ${status}). Response: ${JSON.stringify(response)}`,
              ),
            );
          }
        },
      );
    });
  }
}

export default KavenegarSmsService;
