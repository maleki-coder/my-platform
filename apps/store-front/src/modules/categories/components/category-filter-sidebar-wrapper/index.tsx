// components/category-sidebar-wrapper.tsx
"use client"

import { SidebarProvider, useSidebar } from "@lib/components/ui/sidebar"
import CategoryFilterSidebar from "../category-filter-sidebar"
import CategoryOrderFilter from "../category-order-filter"

interface CategorySidebarWrapperProps {
  isMobile: boolean
  children: React.ReactNode
}

export default function CategorySidebarWrapper({
  isMobile,
  children,
}: CategorySidebarWrapperProps) {
  return (
    <SidebarProvider className="gap-6" defaultOpen={true}>
      <CategoryFilterSidebar />
      <div className="flex flex-col w-full gap-6">
        <CategoryOrderFilter className="h-12" isMobile={isMobile} />
        {children}
      </div>
    </SidebarProvider>
  )
}