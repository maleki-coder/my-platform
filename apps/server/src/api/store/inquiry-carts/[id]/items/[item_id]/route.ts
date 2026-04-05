// src/api/store/inquiry-carts/[id]/items/[item_id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import InquiryService from "../../../../../../modules/inquiry/service";
import { MedusaError } from "@medusajs/utils"; // Import Medusa's error handler
import { InquiryCartCurrency } from "../../../../../types";

interface UpdateInquiryItemRequest {
  title: string;
  quantity: number;
  product_id: string;
  product_handle: string;
  variant_id: string;
  thumbnail: string;
  target_price: string;
  currency: string;
  package: string;
  brand: string;
  link: string;
  description: string;
  datasheet_url: string;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inquiryService = req.scope.resolve("inquiry") as InquiryService;
  const { id, item_id } = req.params;
  const updatePayload: any = { id: item_id };
  const body = req.body as UpdateInquiryItemRequest;
  if (body.title !== undefined) updatePayload.title = body.title;
  if (body.thumbnail !== undefined) updatePayload.thumbnail = body.thumbnail;
  if (body.target_price !== undefined)
    updatePayload.target_price = body.target_price;
  if (body.currency !== undefined)
    updatePayload.currency = body.currency as InquiryCartCurrency;
  if (body.package !== undefined) updatePayload.package = body.package;
  if (body.brand !== undefined) updatePayload.brand = body.brand;
  if (body.link !== undefined) updatePayload.link = body.link;
  if (body.description !== undefined)
    updatePayload.description = body.description;
  if (body.datasheet_url !== undefined)
    updatePayload.datasheet_url = body.datasheet_url;
  if (body.quantity !== undefined) {
    if (!Number.isInteger(body.quantity) || body.quantity <= 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity must be a positive integer. Received: ${body.quantity}`,
      );
    }
    updatePayload.quantity = body.quantity;
  }
  try {
    if (Object.keys(updatePayload).length > 1) {
      // Use the Medusa v2 Array syntax!
      await inquiryService.updateInquiryCartItems([updatePayload]);
    }
  } catch (error: any) {
    console.error(" Update Failed:", error.message);
    return res.status(400).json({
      message: "Failed to update item",
      details: error.message,
    });
  }

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
