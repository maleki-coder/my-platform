// components/category-sidebar-wrapper.tsx
import { Suspense } from "react"
import { SidebarProvider } from "@lib/components/ui/sidebar"
import CategoryOrderFilter, {
  SortOptions,
} from "@modules/categories/components/category-order-filter"
import CategoryFilterSidebar from "@modules/categories/components/category-filter-sidebar"
import {
  getCategoryByHandle,
  getProductCategoryOptions,
} from "@lib/data/categories"
import { CategoryFilterSidebarSkeleton } from "@modules/skeletons/components/skeleton-filter-sidebar"

interface CategorySidebarWrapperProps {
  isMobile: boolean
  order: SortOptions
  categoryHandle: string[]
  children: React.ReactNode
}

async function SidebarDataFetcher({
  categoryHandle,
}: {
  categoryHandle: string[]
}) {
  const productCategory = await getCategoryByHandle(categoryHandle)
  const filterOptions = await getProductCategoryOptions(productCategory.id)

  return <CategoryFilterSidebar filterOptions={filterOptions} />
}

export default function CategorySidebarWrapper({
  isMobile,
  children,
  order,
  categoryHandle,
}: CategorySidebarWrapperProps) {
  return (
    <SidebarProvider className="gap-6" defaultOpen={true}>
      <Suspense fallback={<CategoryFilterSidebarSkeleton />}>
        <SidebarDataFetcher categoryHandle={categoryHandle} />
      </Suspense>

      <div className="flex flex-col w-full gap-6">
        <CategoryOrderFilter
          className="h-12"
          isMobile={isMobile}
          order={order}
        />
        {children}
      </div>
    </SidebarProvider>
  )
}
