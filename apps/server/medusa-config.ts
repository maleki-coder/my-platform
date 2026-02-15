import {
  loadEnv,
  defineConfig,
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      authMethodsPerActor: {
        user: ["emailpass"],
        customer: ["emailpass", "phone-auth"],
      },
    },
  },
  modules: [
    {
      resolve: "./src/modules/product-media",
    },
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [
        Modules.CACHE,
        ContainerRegistrationKeys.LOGGER,
        Modules.EVENT_BUS,
        Modules.CUSTOMER,
        Modules.AUTH,
      ],
      options: {
        providers: [
          // default provider
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "./src/modules/phone-auth",
            id: "phone-auth",
            options: {
              jwtSecret: process.env.PHONE_AUTH_JWT_SECRET || "supersecret",
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          // default provider
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
          {
            resolve: "./src/modules/kavenegar-sms",
            id: "kavenegar-sms",
            options: {
              channels: ["sms"],
              apikey: process.env.KAVENEGAR_API_KEY,
              from: process.env.KAVENEGAR_FROM,
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/strapi",
      options: {
        apiUrl: process.env.STRAPI_API_URL || "http://localhost:1337",
        apiToken: process.env.STRAPI_API_KEY || "",
        defaultLocale: process.env.STRAPI_DEFAULT_LOCALE || "en",
      },
    },
  ],
});
