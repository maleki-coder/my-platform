// src/api/store/inquiry-carts/[id]/items/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import InuquiryService from "../../../../../modules/inquiry/service";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inquiryModuleService = req.scope.resolve("inquiry") as InuquiryService;
  const { id } = req.params;
  const { product_id, variant_id, title, thumbnail, quantity } =
    req.body as any;

  const cart = await inquiryModuleService.retrieveInquiryCart(id, {
    relations: ["items"],
  });
  const existingItem = cart.items?.find(
    (i: any) => i.variant_id === variant_id || i.product_id === product_id,
  );

  if (existingItem) {
    await inquiryModuleService.updateInquiryCartItems(
      { id: existingItem.id },
      {
        quantity: existingItem.quantity + quantity,
      },
    );
  } else {
    await inquiryModuleService.createInquiryCartItems({
      cart_id: id,
      product_id,
      variant_id,
      title,
      thumbnail,
      quantity,
    });
  }

  const updatedCart = await inquiryModuleService.retrieveInquiryCart(id, {
    relations: ["items"],
  });

  res.status(200).json({ cart: updatedCart });
}
