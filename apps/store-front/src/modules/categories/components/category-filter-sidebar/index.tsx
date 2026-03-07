"use client"
import React, { useEffect, useState } from "react"
import {
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@lib/components/ui/sidebar"
import { FilterIcon, HomeIcon, XIcon } from "lucide-react"

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
  const { toggleSidebar } = useSidebar()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY

      if (currentScroll < 0) return // safety

      // if scrolling up or at top → show
      if (currentScroll < lastScroll || currentScroll === 0) {
        setIsVisible(true)
      } else {
        // scrolling down → hide
        setIsVisible(false)
      }

      setLastScroll(currentScroll)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])
  return (
    <Sidebar
      side="right"
      style={isVisible ? { top: "8.5rem" } : { top: "5.5rem" }}
      className={`md:sticky p-0 md:z-1 z-5000 h-fit${
        isVisible
          ? "lg:top-34"
          : "lg:top-22"
      }`}
      variant="floating"
      collapsible="offcanvas"
    >
      <SidebarContent>
        <SidebarHeader className="sticky rounded-t-md h-fit top-0 z-1 bg-white border-b-2 w-full flex-row! flex-nowrap! flex justify-between px-4 py-3.5">
          <div className="flex gap-1.5">
            <FilterIcon className="fill-gray-700 w-4 h-4" />
            <p className=" text-xs font-semibold leading-4 text-gray-800">
              فیلترها
            </p>
          </div>
          <XIcon className="w-4 h-4 sm:invisible md:block" onClick={toggleSidebar} />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 1</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 2</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 3</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 4</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 5</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 6</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 7</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 8</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 9</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 10</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 11</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <HomeIcon />
                  <span>Dashboard 12</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 14</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 15</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 16</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 16</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 17</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 18</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 19</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 20</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 21</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 22</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 23</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 24</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 25</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 26</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 27</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Categories">
                  <HomeIcon />
                  <span>Dashboard 28</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default CategoryFilterSidebar
