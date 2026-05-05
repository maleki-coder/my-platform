import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { id } = req.params;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    try {
        const { data } = await query.graph({
            entity: "product",
            // Fix 1: Wrap the ID in an array for the Query Engine
            filters: { id: [id] },
            fields: [
                "id",
                "options.*",
                "options.values.*",
                // Fix 2: Use snake_case for the injected relation!
                "options.option_extension.*"
            ],
        });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Product not found on stage!" });
        }

        return res.status(200).json({ product: data[0] });
    } catch (error) {
        console.error("Storefront fetching error:", error);
        return res.status(500).json({ message: "Internal server error backstage." });
    }
}
