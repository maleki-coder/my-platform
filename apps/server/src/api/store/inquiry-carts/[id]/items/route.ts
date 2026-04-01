// src/api/store/inquiry-carts/[id]/items/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import InuquiryService from "../../../../../modules/inquiry/service";
import { InquiryCartItem, InquiryCart } from "../../../../types";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inquiryModuleService = req.scope.resolve("inquiry") as InuquiryService;
  const { id } = req.params;
  
  // Cast the body to our strict interface
  const body = req.body as Partial<InquiryCartItem>;

  // Safe Math: Ensure incoming quantity is a valid number, defaulting to 1
  const incomingQuantity = Number(body.quantity) || 1;

  // Retrieve the cart and cast it to our custom InquiryCart interface
  const cart = (await inquiryModuleService.retrieveInquiryCart(id, {
    relations: ["items"],
  })) as unknown as InquiryCart;

  // Find existing item safely
  const existingItem = cart.items?.find(
    (i: InquiryCartItem) =>
      (body.variant_id && i.variant_id === body.variant_id) ||
      (body.product_id && i.product_id === body.product_id)
  );

  if (existingItem) {
    // 🚀 Update: Medusa v2 expects a single object with the ID and the fields to update
    const currentQuantity = Number(existingItem.quantity) || 0;
    
    await inquiryModuleService.updateInquiryCartItems({
      id: existingItem.id,
      // Pure mathematical addition: $Q_{total} = Q_{current} + Q_{incoming}$
      quantity: currentQuantity + incomingQuantity, 
    });
  } else {
    // 🚀 Create: Use cart_id as the generated service expects
    await inquiryModuleService.createInquiryCartItems({
      cart_id: id, 
      product_id: body.product_id,
      variant_id: body.variant_id,
      title: body.title, 
      thumbnail: body.thumbnail,
      quantity: incomingQuantity,
      brand: body.brand,
      currency: body.currency,
      datasheet_url: body.datasheet_url,
      description: body.description,
      link: body.link,
      package: body.package, 
      product_handle: body.product_handle,
      target_price: body.target_price,
    });
  }

  // Fetch the freshly updated cart to return to the client
  const updatedCart = await inquiryModuleService.retrieveInquiryCart(id, {
    relations: ["items"],
  });

  res.status(200).json({ cart: updatedCart });
}
