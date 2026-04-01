// src/api/store/inquiry-carts/[id]/items/[item_id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import InuquiryService from "../../../../../../modules/inquiry/service";

// ویرایش تعداد
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inquiryModuleService = req.scope.resolve("inquiry") as InuquiryService;
  const { id, item_id } = req.params;
  const { quantity } = req.body as any;

  await inquiryModuleService.updateInquiryCartItems(
    { id: item_id },
    { quantity },
  );

  const updatedCart = await inquiryModuleService.retrieveInquiryCart(id, {
    relations: ["items"],
  });
  res.status(200).json({ cart: updatedCart });
}

// حذف آیتم
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const inquiryModuleService = req.scope.resolve("inquiry") as InuquiryService;
  const { id, item_id } = req.params;

  await inquiryModuleService.deleteInquiryCartItems({ id: item_id });

  const updatedCart = await inquiryModuleService.retrieveInquiryCart(id, {
    relations: ["items"],
  });
  res.status(200).json({ cart: updatedCart });
}
