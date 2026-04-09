import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // The middleware guarantees this exists and is valid!
    const customerId = (req as any).auth_context.actor_id;
    const inquiryModuleService = req.scope.resolve("inquiry");

    const inquiries = await inquiryModuleService.listInquiryCarts(
      {
        customer_id: customerId,
        status: ["submitted", "contacted"],
      },
      { order: { created_at: "DESC" } },
    );

    return res.status(200).json(inquiries);
  } catch (error: any) {
    console.error("Error fetching customer inquiries:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
