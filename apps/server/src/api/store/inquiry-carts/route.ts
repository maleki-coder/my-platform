// src/api/store/inquiry-carts/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import InuquiryService from "../../../modules/inquiry/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inquiryModuleService = req.scope.resolve("inquiry") as InuquiryService
  const cart = await inquiryModuleService.createInquiryCarts({
    status: "active",
  })

  res.status(201).json( cart )
}
