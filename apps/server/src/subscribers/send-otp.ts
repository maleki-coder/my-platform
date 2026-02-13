import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { Modules } from "@medusajs/framework/utils";

export default async function sendOtpHandler({
  event: {
    data: { phone, otp },
  },
  container,
}: SubscriberArgs<{ phone: string; otp: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);

  await notificationModuleService.createNotifications({
    to: phone,
    channel: "sms",
    template: "otp-template",
    data: {
      otp,
      message: "کد احراز هویت شما : ",
    },
  });
}

export const config: SubscriberConfig = {
  event: "phone-auth.otp.generated",
};
