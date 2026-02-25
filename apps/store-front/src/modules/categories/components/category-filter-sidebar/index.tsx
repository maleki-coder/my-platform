"use client"
import React, { useRef } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@lib/components/ui/sidebar"
import { HomeIcon, Plus } from "lucide-react"

interface CategoryImage {
  url: string
  type?: string
}

interface Category {
  id: string
  handle: string
  name: string
  product_category_image?: CategoryImage[]
}

interface CategoryFilterSidebarProps {
  categories?: Category[]
  setOpen?: (open: boolean) => void
  handleHover?: (item: Category, index: number) => void
  hasChildrenAndImage?: (category: Category) => boolean
}

const CategoryFilterSidebar: React.FC<CategoryFilterSidebarProps> = ({}) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { open, setOpen } = useSidebar()
  return (
    //<div
    //   className="fixed inset-0 z-5"
    //   onClick={() => setOpen(false)}
    //>
    <Sidebar
    //   style={{ top: "20.5rem", height: "calc(100vh - 12.5rem)" }}
      side="right"
      className="sticky z-1000"
      variant="floating"
      collapsible="icon"
    >
    <SidebarTrigger />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Categories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    // </div>
  )
}

export default CategoryFilterSidebar
