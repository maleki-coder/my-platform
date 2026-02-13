import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { CreateCategoryImagesSchema } from "./admin/categories/[category_id]/images/route";
import {
  DeleteCategoryImagesSchema,
  UpdateCategoryImagesSchema,
} from "./admin/categories/[category_id]/images/batch/route";
import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/categories/:category_id/images",
      method: ["POST"],
      middlewares: [validateAndTransformBody(CreateCategoryImagesSchema)],
    },
    {
      matcher: "/admin/categories/:category_id/images/batch",
      method: ["POST"],
      middlewares: [validateAndTransformBody(UpdateCategoryImagesSchema)],
    },
    {
      matcher: "/admin/categories/:category_id/images/batch",
      method: ["DELETE"],
      middlewares: [validateAndTransformBody(DeleteCategoryImagesSchema)],
    },
    {
      matcher: "/webhooks/strapi",
      middlewares: [
        async (
          req: MedusaRequest,
          res: MedusaResponse,
          next: MedusaNextFunction
        ) => {
          const apiKeyModuleService = req.scope.resolve(Modules.API_KEY);

          // Extract Bearer token from Authorization header
          const authHeader = req.headers["authorization"];
          const apiKey = authHeader?.replace("Bearer ", "");

          if (!apiKey) {
            return res.status(401).json({
              message: "Unauthorized: Missing API key",
            });
          }

          try {
            // Validate the API key using Medusa's API Key Module
            const isValid = await apiKeyModuleService.authenticate(apiKey);

            if (!isValid) {
              return res.status(401).json({
                message: "Unauthorized: Invalid API key",
              });
            }

            // API key is valid, proceed to route handler
            next();
          } catch (error) {
            return res.status(401).json({
              message: "Unauthorized: API key authentication failed",
            });
          }
        },
      ],
    },
  ],
});
