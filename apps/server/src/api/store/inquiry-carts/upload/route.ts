// src/api/store/inquiry-carts/upload/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { IFileModuleService } from "@medusajs/types";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    // 1. Resolve the File Module Service
    const fileModuleService: IFileModuleService = req.scope.resolve(Modules.FILE);

    // 2. Medusa automatically parses multipart/form-data into req.files
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No file provided. $Files = 0$" });
    }

    const file = files[0];

    // 3. Mathematical Validation: strictly allow ONLY PDFs!
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Invalid format. Only PDF files are allowed!" });
    }

    // Limit size to 5MB: $Size_{max} = 5 \times 1024 \times 1024 \text{ bytes}$
    if (file.size > 5242880) {
      return res.status(400).json({ error: "File exceeds the 5MB limit." });
    }

    // 4. Upload the file using Medusa's File Module
    const uploadedFile = await fileModuleService.createFiles([
      {
        filename: file.originalname,
        mimeType: file.mimetype,
        content: file.buffer.toString("base64"), // Depending on your provider, you might pass the buffer or base64
        access: "public",
      },
    ]);

    // 5. Return the newly generated URL to the storefront
    return res.status(200).json({ url: uploadedFile[0].url });

  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({ error: "Internal Server Error during upload." });
  }
}
