// src/api/admin/inquiries/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // 1. Resolve your exact service from the Medusa container!
    // The key "inquiry" matches the exported INQUIRY_MODULE name.
    const inquiryModuleService = req.scope.resolve("inquiry");
    const customerModuleService = req.scope.resolve("customer"); // Just in case we need to fallback to Customer DB

    // 2. Fetch the data directly using the auto-generated list method.
    // We filter out "active" (cart still being built) and order by newest first.
    // Database time complexity is $O(\log N)$ thanks to proper indexing on sorting!
    const inquiries = await inquiryModuleService.listInquiryCarts(
      {
        status: ["submitted", "contacted"],
      },
      {
        order: { created_at: "DESC" },
      }
    );

    // If you have zero inquiries here, check your DB to ensure the statuses are actually "submitted"!
    if (!inquiries || inquiries.length === 0) {
      return res.status(200).json({ inquiries: [] });
    }

    // 3. Extract unique customer IDs (if they are logged in and attached)
    const customerIds = [...new Set(inquiries.map((i: any) => i.customer_id).filter(Boolean))];

    // 4. Fetch related customers if they exist
    const customers = customerIds.length > 0 
      ? await customerModuleService.listCustomers({ id: customerIds }) 
      : [];

    // 5. Build an $O(1)$ lookup map for customers
    const customerMap = new Map(customers.map((c: any) => [
      c.id, 
      `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.email
    ]));

    // 6. Map the data precisely to what the Frontend Table expects
    const mappedInquiries = inquiries.map((cart: any) => {
      // Logic mapping: Database Status -> Frontend UI Status
      let uiStatus = "pending";
      if (cart.status === "contacted") uiStatus = "reviewed";

      // Resolve the best available name: 
      // 1. The one they typed in the form (cart.customer_name)
      // 2. The registered user's name from the Map
      // 3. Fallback text
      const resolvedName = cart.customer_name 
        || customerMap.get(cart.customer_id) 
        || "Unknown Customer";

      return {
        id: cart.id,
        customer_name: resolvedName,
        email: cart.email || "No Email Provided",
        phone: cart.phone || "No Phone Provided",
        status: uiStatus,
        created_at: cart.created_at || new Date().toISOString(),
      };
    });

    // 7. Send the beautiful data back to the admin panel!
    return res.status(200).json({ inquiries: mappedInquiries });

  } catch (error: any) {
    console.error("🔥 Error fetching inquiries:", error.message);
    return res.status(500).json({ 
      message: "Failed to retrieve inquiries. Check server logs.",
      error: error.message 
    });
  }
};
