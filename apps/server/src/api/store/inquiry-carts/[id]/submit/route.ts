// src/api/store/inquiry-carts/[id]/submit/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import InuquiryService from "../../../../../modules/inquiry/service";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inquiryModuleService = req.scope.resolve("inquiry") as InuquiryService;
  const { id } = req.params;
  const { email, phone, customer_name, notes } = req.body as any;

  const submittedCart = await inquiryModuleService.updateInquiryCarts(
    { id: id },
    {
      status: "submitted",
      email,
      phone,
      customer_name,
      notes,
    },
  );

  res
    .status(200)
    .json({ cart: submittedCart, message: "استعلام با موفقیت ثبت شد" });
}
