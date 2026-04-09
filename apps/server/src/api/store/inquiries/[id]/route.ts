import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const customerId = (req as any).auth_context.actor_id;
    const { id } = req.params;
    const inquiryModuleService = req.scope.resolve("inquiry");

    // Fetch the cart, strictly scoped to this specific customer
    const [inquiry] = await inquiryModuleService.listInquiryCarts({
      id: id,
      customer_id: customerId,
    });

    // If it doesn't exist or doesn't belong to them, return 404
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }

    const items = await inquiryModuleService.listInquiryCartItems({
      cart_id: id,
    });

    return res.status(200).json({ inquiry, items });
  } catch (error: any) {
    console.error(" Error fetching inquiry details:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
