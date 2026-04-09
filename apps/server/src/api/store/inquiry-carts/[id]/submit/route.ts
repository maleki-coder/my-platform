// src/api/store/inquiry-carts/[id]/submit/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    // 1. Resolve the service dynamically
    const inquiryModuleService = req.scope.resolve("inquiry");
    
    // 2. Extract params and body
    const { id } = req.params;
    const { email, phone, customer_name, notes, customer_id } = req.body as any;

    // 3. 💥 THE FIX: Pass a single object combining the ID and the update data!
    // The auto-generated method expects: { id: string, [key: string]: any }
    // It usually returns an array of updated entities, so we destructure [submittedCart]
    const [submittedCart] = await inquiryModuleService.updateInquiryCarts([{
      id: id,
      status: "submitted", // Changing the status!
      email: email,
      customer_id: customer_id,
      phone: phone,
      customer_name: customer_name,
      notes: notes,
    }]);

    // 4. Return the beautifully updated cart
    return res.status(200).json({ submittedCart });

  } catch (error: any) {
    console.error("🔥 Error submitting inquiry cart:", error.message);
    return res.status(500).json({ 
      message: "Failed to submit the inquiry cart.",
      error: error.message 
    });
  }
}
