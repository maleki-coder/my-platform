import {
  AbstractAuthModuleProvider,
  AbstractEventBusModuleService,
  MedusaError,
} from "@medusajs/framework/utils";
import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  IAuthModuleService,
  ICustomerModuleService,
  Logger,
} from "@medusajs/types";
import { AuthIdentityDTO } from "@medusajs/types";
import jwt from "jsonwebtoken";
type InjectedDependencies = {
  logger: Logger;
  event_bus: AbstractEventBusModuleService;
  customer: ICustomerModuleService;
  auth: IAuthModuleService;
};

type Options = {
  jwtSecret: string;
};

class PhoneAuthService extends AbstractAuthModuleProvider {
  static DISPLAY_NAME = "Phone Auth";
  static identifier = "phone-auth";
  private options: Options;
  private logger: Logger;
  private event_bus: AbstractEventBusModuleService;
  private customerModuleService: ICustomerModuleService;
  private auth: IAuthModuleService;
  constructor(container: InjectedDependencies, options: Options) {
    // @ts-ignore
    super(...arguments);

    this.options = options;
    this.logger = container.logger;
    this.event_bus = container.event_bus;
    this.customerModuleService = container.customer;
    this.auth = container.auth;
  }
  async authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { phone } = data.body || {};

    // --- Validate Input ---
    if (!phone) {
      return {
        success: false,
        error: "شماره تلفن همراه اجباری است",
      };
    }
    // --- Check if user exists ---
    let identity: AuthIdentityDTO;
    try {
      identity = await authIdentityProviderService.retrieve({
        entity_id: phone,
      });
    } catch (_err) {
      return {
        success: false,
        error:
          "کاربری با شماره همراه وارد شده یافت نشد. لطفا ابتدا ثبت نام کنید",
      };
    }

    // --- Generate OTP ---
    let hashedOTP: string;
    let otp: string;

    try {
      const otpData = await this.generateOTP();
      hashedOTP = otpData.hashedOTP;
      otp = otpData.otp;
    } catch (err) {
      return {
        success: false,
        error: "خطا در رمز یکبار مصرف",
      };
    }

    // --- Save OTP on user provider metadata ---
    try {
      await authIdentityProviderService.update(phone, {
        provider_metadata: {
          otp: hashedOTP,
        },
      });
    } catch (_err) {
      return {
        success: false,
        error: "خطا در رمز یکبار مصرف",
      };
    }

    // --- Emit OTP event ---
    try {
      await this.event_bus.emit(
        {
          name: "phone-auth.otp.generated",
          data: { otp, phone },
        },
        {}
      );
    } catch (_err) {
      return {
        success: false,
        error: "خطا در ارسال پیام رمز یکبار مصرف",
      };
    }

    // --- Success Response ---
    return {
      success: true,
      location: "otp",
    };
  }

  async generateOTP(): Promise<{ hashedOTP: string; otp: string }> {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // for debug
    this.logger.info(`Generated OTP: ${otp}`);

    const hashedOTP = jwt.sign({ otp }, this.options.jwtSecret, {
      expiresIn: "60s",
    });

    return { hashedOTP, otp };
  }

  static validateOptions(options: Record<any, any>): void | never {
    if (!options.jwtSecret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "JWT secret is required"
      );
    }
  }

  async validateCallback(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { phone, otp } = data.query || {};

    if (!phone || !otp) {
      return {
        success: false,
        error: "شماره تلفن همراه و کد یکبار مصرف اجباری است",
      };
    }

    const user = await authIdentityProviderService.retrieve({
      entity_id: phone,
    });

    if (!user) {
      return {
        success: false,
        error:
          "کاربری با شماره همراه وارد شده یافت نشد. لطفا ابتدا ثبت نام کنید",
      };
    }

    // verify that OTP is correct
    const userProvider = user.provider_identities?.find(
      (provider) => provider.provider === this.identifier
    );
    if (!userProvider || !userProvider.provider_metadata?.otp) {
      return {
        success: false,
        error: "User with phone number does not have a phone auth provider",
      };
    }

    try {
      const decodedOTP = jwt.verify(
        userProvider.provider_metadata.otp as string,
        this.options.jwtSecret
      ) as { otp: string };

      if (decodedOTP.otp !== otp) {
        throw new Error("کد یکبار مصرف وارد شده صحیح نیست");
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "کد یکبار مصرف وارد شده صحیح نیست",
      };
    }
    try {
      const updatedUser = await authIdentityProviderService.update(phone, {
        provider_metadata: {
          otp: null,
        },
      });

      return {
        success: true,
        authIdentity: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async register(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { phone } = data.body || {};

    if (!phone) {
      return {
        success: false,
        error: "شماره تلفن همراه اجباری است",
      };
    }

    try {
      await authIdentityProviderService.retrieve({
        entity_id: phone,
      });

        return {
          success: false,
          error: "کاربر با شماره وارد شده وجود دارد. لطفا وارد شوید.",
        };
    } catch (error) {
      const user: AuthIdentityDTO = await authIdentityProviderService.create({
        entity_id: phone,
      });

      return {
        success: true,
        authIdentity: user,
      };
    }
  }
}

export default PhoneAuthService;
