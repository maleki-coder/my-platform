import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params;
  
  // Resolve your custom module
  const inquiryModuleService = req.scope.resolve("inquiry");

  // Use the auto-generated update method to change the DB status
  await inquiryModuleService.updateInquiryCarts({
    id: id,
    status: "contacted", // Maps to "reviewed" in the UI
  });

  res.status(200).json({ 
    success: true,
    message: `Inquiry ${id} status updated to contacted.`
  });
};
