import { getCategoryByHandle } from "@lib/data/categories"
import ChildCategoryChipsClient from "@modules/common/components/child-category-client"
type Props = {
  categoryHandle: string[]
  "data-testid"?: string
}
const ChildCategpryChips = async ({ categoryHandle, "data-testid": dataTestId } : Props) => {
  const productCategory = await getCategoryByHandle(categoryHandle)

  if (!productCategory?.category_children?.length) return null

  return (
    <ChildCategoryChipsClient
      data-testid={dataTestId}
      categories={productCategory.category_children}
    />
  )
}

export default ChildCategpryChips
