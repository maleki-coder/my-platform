// src/api/store/inquiry-carts/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import InuquiryService from "../../../../modules/inquiry/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const inquiryModuleService = req.scope.resolve("inquiry") as InuquiryService;
  const { id } = req.params;

  try {
    const cart = await inquiryModuleService.retrieveInquiryCart(id, {
      relations: ["items"],
    });
    res.status(200).json({ cart });
  } catch (error) {
    res.status(404).json({ message: "سبد یافت نشد" });
  }
}
