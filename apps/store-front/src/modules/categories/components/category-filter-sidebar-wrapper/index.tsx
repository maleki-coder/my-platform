// components/category-sidebar-wrapper.tsx
"use client"

import { SidebarProvider } from "@lib/components/ui/sidebar"
import CategoryOrderFilter, {
  SortOptions,
} from "@modules/categories/components/category-order-filter"
import CategoryFilterSidebar from "@modules/categories/components/category-filter-sidebar"
import { CategoryOption } from "types/global"

interface CategorySidebarWrapperProps {
  isMobile: boolean
  sortBy: SortOptions
  filterOptions: CategoryOption[]
  children: React.ReactNode
}

export default function CategorySidebarWrapper({
  isMobile,
  children,
  sortBy,
  filterOptions
}: CategorySidebarWrapperProps) {
  return (
    <SidebarProvider className="gap-6" defaultOpen={true}>
      <CategoryFilterSidebar filterOptions={filterOptions} />
      <div className="flex flex-col w-full gap-6">
        <CategoryOrderFilter
          className="h-12"
          isMobile={isMobile}
          sortBy={sortBy}
        />
        {children}
      </div>
    </SidebarProvider>
  )
}
