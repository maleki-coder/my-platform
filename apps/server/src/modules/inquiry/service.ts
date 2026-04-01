// src/modules/product-reviews/service.ts
import { MedusaService } from "@medusajs/framework/utils";
import { InquiryCartItem } from "./models/inquiry-cart-item";
import { InquiryCart } from "./models/Inquiry-cart";

class InuquiryService extends MedusaService({
  InquiryCartItem,
  InquiryCart,
}) {}

export default InuquiryService;
