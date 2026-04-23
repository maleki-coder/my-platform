import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

// --- GET DETAILS ---
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // Fetch the specific cart WITH its relation (items)
  const { data: inquiryCarts } = await query.graph({
    entity: "inquiry_cart",
    fields: [
      "*", // Get all cart fields
      "items.*", // Get all fields of related items
    ],
    filters: { id },
  });

  if (!inquiryCarts || inquiryCarts.length === 0) {
    return res.status(404).json({ message: "Inquiry not found" });
  }

  const cart = inquiryCarts[0];

  // Map DB status to UI status
  let uiStatus = "pending";
  if (cart.status === "contacted") uiStatus = "reviewed";

  // Map the items to match the UI `BOMItem` structure
  const mappedItems =
    cart.items?.map((item: any) => ({
      id: item.id,
      part_number: item.title || item.product_handle || "Unknown Part",
      quantity: item.quantity,
      target_price: item.target_price,
      datasheet_url: item.datasheet_url,
      currency: item.currency,
      package: item.package,
      brand: item.brand,
      link: item.link,
      description: item.description,
      thumbnail: item.thumbnail,
    })) || [];

  const mappedDetails = {
    id: cart.id,
    customer_name: cart.customer_name || "Unknown",
    email: cart.email || "No email",
    phone: cart.phone || "No phone",
    notes: cart.notes || "",
    status: uiStatus,
    created_at: cart.created_at || new Date().toISOString(),
    items: mappedItems,
  };

  res.status(200).json({ inquiry: mappedDetails });
};

// --- DELETE INQUIRY ---
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  // Resolve your custom module service using the module key string
  const inquiryModuleService = req.scope.resolve("inquiry");

  // Use the auto-generated MedusaService method
  await inquiryModuleService.deleteInquiryCarts(id);

  res.status(200).json({
    id,
    object: "inquiry_cart",
    deleted: true,
  });
};
