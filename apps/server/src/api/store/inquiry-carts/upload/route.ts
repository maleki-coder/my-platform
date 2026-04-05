// src/api/store/inquiry-carts/upload/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { uploadFilesWorkflow } from "@medusajs/core-flows"; // Built-in workflow for uploads
import multer from "multer"; // For parsing multipart form data (install: npm install multer)
const MAX_FILE_SIZE = 1048576;
export const config = {
  bodyParser: false,
};
// Multer middleware for file parsing (single file named 'receipt')
const upload = multer({ storage: multer.memoryStorage() }).single("datasheet");
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
  if (file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: "File exceeds the 1MB limit." });
  }

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

    const fileUrl = uploadedFiles[0].url; // URL from File provider
    return res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("File upload error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error during upload." });
  }
}
