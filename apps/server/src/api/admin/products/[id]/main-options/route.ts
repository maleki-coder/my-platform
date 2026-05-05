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
            filters: { id: [id] },
            fields: [
                "id",
                "options.*",
                "options.option_extension.*" // Fetching the VIP data!
            ],
        });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        return res.status(200).json({ product: data[0] });
    } catch (error) {
        console.error("Admin fetching error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
