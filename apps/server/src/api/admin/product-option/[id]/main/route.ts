import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const optionId = req.params.id;
    const { is_main_character } = req.body as any;

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.LINK);
    
    // Ensure "optionExtension" matches the name in your medusa-config.js exacty!
    const optionExtensionService = req.scope.resolve("optionExtension"); 

    // 1. The Elegant Approach: Use Query Engine to check for existing links $O(1)$
    const { data: options } = await query.graph({
      entity: "product_option",
      fields: ["id", "option_extension.*"],
      filters: {
        id: optionId,
      },
    });

    const existingExtension = options[0]?.option_extension;

    if (existingExtension) {
      // 2. Update existing extension
      await optionExtensionService.updateOptionExtensions({
        id: existingExtension.id,
        is_main_character,
      });

      return res.json({
        success: true,
        extension_id: existingExtension.id,
      });
    } else {
      // 3. Create new extension
      const [newExtension] = await optionExtensionService.createOptionExtensions([
        {
          is_main_character,
        },
      ]);

      // 4. The Correct Remote Link Syntax! 🌟
      // We must pass an object with EXACTLY two keys corresponding to the module names.
      await remoteLink.create({
        [Modules.PRODUCT]: {
          product_option_id: optionId,
        },
        "optionExtension": { // This key must match your custom module's registered name
          option_extension_id: newExtension.id,
        },
      });

      return res.json({
        success: true,
        extension_id: newExtension.id,
      });
    }
  } catch (error) {
    console.error("Error updating option extension:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};
