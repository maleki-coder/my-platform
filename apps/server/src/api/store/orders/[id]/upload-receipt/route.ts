import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { uploadFilesWorkflow } from "@medusajs/core-flows"; // Built-in workflow for uploads
import multer from "multer"; // For parsing multipart form data (install: npm install multer)

export const config = {
  bodyParser: false,
};
// Multer middleware for file parsing (single file named 'receipt')
const upload = multer({ storage: multer.memoryStorage() }).single("receipt");

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Parse file with multer
  await new Promise((resolve, reject) => {
    upload(req as any, res as any, (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });

  const file = (req as any).file; // Access the uploaded file
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const orderId = req.params.id;
  const orderModule = req.scope.resolve(Modules.ORDER);
  //   const fileModule = req.scope.resolve(Modules.FILE);

  try {
    // Upload file using workflow (or directly via fileModule.upload)
    const { result: uploadedFiles } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: [
          {
            filename: file.originalname,
            content: file.buffer,
            mimeType: file.mimetype,
            access: "public",
          },
        ],
      },
    });

    const receiptUrl = uploadedFiles[0].url; // URL from File provider

    // Update order metadata (merges with existing)
    await orderModule.updateOrders([
      {
        id: orderId,
        metadata: { receipt_url: receiptUrl }, // Add to metadata
      },
    ]);

    return res.json({ message: "Receipt uploaded", url: receiptUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
