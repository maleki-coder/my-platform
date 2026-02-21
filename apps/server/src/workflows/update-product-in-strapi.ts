import {
  createWorkflow,
  WorkflowResponse,
  when,
  transform,
} from "@medusajs/framework/workflows-sdk";
import {
  UpdateProductInStrapiInput,
  updateProductInStrapiStep,
} from "./steps/update-product-in-strapi";
import { uploadImagesToStrapiStep } from "./steps/upload-images-to-strapi";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { createProductInStrapiWorkflow } from "./create-product-in-strapi";

export type UpdateProductInStrapiWorkflowInput = {
  id: string;
};

export const updateProductInStrapiWorkflow = createWorkflow(
  "update-product-in-strapi",
  (input: UpdateProductInStrapiWorkflowInput) => {
    // 1. Fetch the product with all needed fields
    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: [
        "id",
        "title",
        "subtitle",
        "description",
        "handle",
        "images.url",
        "thumbnail",
        "metadata",
      ],
      filters: { id: input.id },
      options: { throwIfKeyNotFound: true },
    });

    const product = products[0];

    // 2. If the product doesn't exist in Strapi, create it
    const created = when(
      { product },
      (data) => {
        // Use a type assertion to help TypeScript
        const metadata = (data.product as any).metadata;
        return !metadata?.strapi_id;
      }
    ).then(() => {
      return createProductInStrapiWorkflow.runAsStep({
        input: { id: input.id },
      });
    });

    // 3. If it does exist, update it
    const updated = when(
      { product },
      (data) => !!data.product.metadata?.strapi_id,
    ).then(() => {
      // Upload all current images (always)
      const imageItems = transform({ product }, (data) =>
        data.product.images.map((img) => ({
          entity_id: data.product.id,
          url: img.url,
        })),
      );
      const uploadedImages = uploadImagesToStrapiStep({ items: imageItems });

      // Upload thumbnail conditionally – if none, pass empty array (step must handle it)
      const thumbnailItems = transform({ product }, (data) =>
        data.product.thumbnail
          ? [{ entity_id: product.id, url: data.product.thumbnail! }]
          : [],
      );
      const uploadedThumbnail = uploadImagesToStrapiStep({
        items: thumbnailItems,
      }).config({
        name: "upload-product-thumbnail",
      });

      // Prepare update payload with Strapi image IDs
      const updatePayload = transform(
        { product, uploadedImages, uploadedThumbnail },
        (data) => ({
          id: data.product.id, // Medusa product ID
          strapiId: data.product.metadata!.strapi_id, // Existing Strapi ID
          title: data.product.title,
          subtitle: data.product.subtitle,
          description: data.product.description,
          handle: data.product.handle,
          imageIds: data.uploadedImages.map((img) => img.image_id),
          thumbnailId: data.uploadedThumbnail[0]?.image_id, // may be undefined
        }),
      );

      // Update the product in Strapi
      const strapiResult = updateProductInStrapiStep({
        product: updatePayload,
      } as UpdateProductInStrapiInput);

      return strapiResult;
    });

    // 4. Return the result from whichever branch executed
    const result = transform(
      { created, updated },
      (data) => data.created || data.updated,
    );

    return new WorkflowResponse(result);
  },
);
