import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from "@lib/components/ui/sidebar" // مسیر ایمپورت خود را در صورت نیاز اصلاح کنید

export function CategoryFilterSidebarSkeleton() {
  return (
    <Sidebar
      side="right"
      style={{ top: "5.5rem", height: "calc(100vh - 5.5rem)" }}
      className={`md:sticky p-0 md:z-1 z-5000 lg:top-22`}
      variant="floating"
      collapsible="offcanvas"
    >
      <SidebarContent className="bg-white rounded-md shadow-sm overflow-y-auto h-full pb-24 overscroll-contain">
        {/* هدر سایدبار */}
        <SidebarHeader className="sticky rounded-t-md h-fit top-0 z-1 bg-white border-b-2 w-full flex-row! flex-nowrap! flex justify-between px-4 py-3.5">
          {/* آیکون فیلتر */}
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent className="p-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sectionId) => (
              <div
                key={sectionId}
                className="w-full h-8 bg-gray-200 rounded animate-pulse mb-4"
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
