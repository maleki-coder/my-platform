// src/api/store/inquiry-carts/[id]/items/[item_id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import InquiryService from "../../../../../../modules/inquiry/service";
import { MedusaError } from "@medusajs/utils"; // Import Medusa's error handler

interface UpdateInquiryItemRequest {
  quantity: number;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inquiryService = req.scope.resolve("inquiry") as InquiryService;
  const { id, item_id } = req.params;

  const { quantity } = req.body as UpdateInquiryItemRequest;

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Quantity must be a positive integer. Received: ${quantity}`,
    );
  }

  await inquiryService.updateInquiryCartItems({
    id: item_id,
    quantity: quantity,
  });

  const updatedCart = await inquiryService.retrieveInquiryCart(id, {
    relations: ["items"],
  });

  res.status(200).json({ cart: updatedCart });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const inquiryService = req.scope.resolve("inquiry") as InquiryService;
  const { id, item_id } = req.params;

  await inquiryService.deleteInquiryCartItems({ id: item_id });

  // re-fetching ensures synchronization.
  const updatedCart = await inquiryService.retrieveInquiryCart(id, {
    relations: ["items"],
  });

  res.status(200).json({ cart: updatedCart });
}
