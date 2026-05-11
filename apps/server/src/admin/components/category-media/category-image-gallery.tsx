// path/to/your/components/category-image-gallery.tsx

import { Text } from "@medusajs/ui"
import { CategoryImage, UploadedFile } from "../../types"
import { CategoryImageItem } from "./category-image-item"
import { useTranslation } from "react-i18next"

type CategoryImageGalleryProps = {
  existingImages: CategoryImage[]
  uploadedFiles: UploadedFile[]
  currentThumbnailId: string | null
  selectedImageIds: Set<string>
  onToggleSelect: (id: string, isUploaded?: boolean) => void
  imagesToDelete: Set<string>
}

export const CategoryImageGallery = ({
  existingImages,
  uploadedFiles,
  currentThumbnailId,
  selectedImageIds,
  onToggleSelect,
  imagesToDelete
}: CategoryImageGalleryProps) => {
  const { t } = useTranslation()

  const visibleExistingImages = existingImages.filter(
    (image) => image.id && !imagesToDelete.has(image.id)
  )

  const hasNoImages = visibleExistingImages.length === 0 && uploadedFiles.length === 0;

  return (
    <div className="bg-ui-bg-subtle size-full overflow-auto">
      <div className="grid h-fit auto-rows-auto grid-cols-4 gap-6 p-6">
        {visibleExistingImages.map((image) => {
          if (!image.id) { return null }

          const imageId = image.id
          const isThumbnail = currentThumbnailId === imageId

          return (
            <CategoryImageItem
              key={imageId}
              id={imageId}
              url={image.url}
              alt={t("category-media-modal.gallery-image-alt-text", {
                type: image.type,
              })}
              isThumbnail={isThumbnail}
              isSelected={selectedImageIds.has(imageId)}
              onToggleSelect={() => onToggleSelect(imageId)}
            />
          )
        })}

        {/* Newly uploaded files */}
        {uploadedFiles.map((file) => {
          const uploadedId = `uploaded:${file.id}`
          const isThumbnail = currentThumbnailId === uploadedId

          return (
            <CategoryImageItem
              key={file.id}
              id={file.id}
              url={file.url}
              alt={t("category-media-modal.gallery-uploaded-image-alt-text", "Uploaded")}
              isThumbnail={isThumbnail}
              isSelected={selectedImageIds.has(uploadedId)}
              onToggleSelect={() => onToggleSelect(file.id, true)}
            />
          )
        })}

        {/* Empty state */}
        {hasNoImages && (
          <div className="col-span-4 flex items-center justify-center p-8">
            <Text className="text-ui-fg-subtle text-center">
              {t(
                "category-media-modal.gallery-no-images-placeholder",
                "No images yet. Upload images to get started."
              )}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
