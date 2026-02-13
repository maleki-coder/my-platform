import { CategoryWithImages } from "types/global"

// 1. Helper to build a proper nested tree from flat categories
export const buildCategoryTree = (categories: CategoryWithImages[])=> {
  const map = new Map<
    string,
    CategoryWithImages & { category_children: CategoryWithImages[] }
  >()

  // Initialize map and ensure category_children exists
  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, category_children: [] })
  })

  const tree: (CategoryWithImages & {
    category_children: CategoryWithImages[]
  })[] = []

  categories.forEach((cat) => {
    if (cat.parent_category_id) {
      const parent = map.get(cat.parent_category_id)
      if (parent) {
        parent.category_children.push(map.get(cat.id)!)
      }
    } else {
      tree.push(map.get(cat.id)!)
    }
  })

  return tree
}