"use client"

import { useState, useRef, useEffect } from "react"
import { useDebounce } from "@lib/hooks/use-debounce"
import SearchedProductBox from "@modules/layout/components/searched-product-box"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lib/components/ui/popover"
import PopOverContentSearchContainer from "../pop-over-content-search-container"
import { useSearchProductsByName } from "@lib/hooks/use-search-product-by-name"
import { Input } from "@lib/components/ui/input"
import { SearchIcon, X } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog"
import { Spinner } from "@lib/components/ui/spinner"
import { MOBILE_FOOTER_HEIGHT } from "@lib/util/constants"

export default function HeaderSearchInput() {
  // 1. Split the states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const [inputWidth, setInputWidth] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  // Debounce the input
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const {
    data: products,
    isLoading,
    error,
  } = useSearchProductsByName(debouncedSearchTerm)

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth)
    }
  }, [inputRef.current?.offsetWidth])

  // Prevent toggle when clicking already-focused input (Desktop only)
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (popoverOpen && inputRef.current === document.activeElement) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Specialized handler for Desktop Popover
  const handlePopoverOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Defer closing to allow the input's blur event to run
      setTimeout(() => {
        if (inputRef.current === document.activeElement) return
        setPopoverOpen(newOpen)
      }, 0)
      return
    }
    setPopoverOpen(newOpen)
  }

  if (error) {
    return <div>error</div>
  }

  return (
    <>
      {/* MOBILE DIALOG CONTAINER */}
      <div className="md:hidden block">
        <Dialog
          defaultOpen={false}
          modal={true}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Search"
              className="flex items-center cursor-pointer"
            >
              <SearchIcon />
            </button>
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            className="flex flex-col p-0 min-w-full m-0 rounded-none z-100 top-0 translate-y-0"
            style={{ height: `calc(100vh - ${MOBILE_FOOTER_HEIGHT})` }}
          >
            <VisuallyHidden>
              <DialogTitle>جستجوی محصولات</DialogTitle>
            </VisuallyHidden>
            <div className="flex items-center gap-3 p-4 border-b">
              <Input
                autoFocus={false}
                value={searchTerm}
                placeholder="جستجو کنید"
                onChange={handleInputChange}
                className="flex-1"
              />
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close search"
                  className="cursor-pointer shrink-0 rounded-md p-2 hover:bg-muted transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </DialogClose>
            </div>

            {/* Results */}
            <div className="flex-1 w-full overflow-auto p-0 md:p-3">
              <PopOverContentSearchContainer searchTerm={searchTerm}>
                {products?.map((product) => (
                  <SearchedProductBox
                    key={product.id}
                    product={product}
                    onNavigate={() => setDialogOpen(false)} // Close specific state
                  />
                ))}
              </PopOverContentSearchContainer>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* DESKTOP POPOVER CONTAINER */}
      <div className="md:block hidden w-full max-w-160 flex-1">
        <Popover open={popoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                className="w-full h-12 transition-all duration-300"
                ref={inputRef}
                value={searchTerm}
                placeholder="جستجو کنید"
                onChange={handleInputChange}
                onClick={handleInputClick}
              />
            </div>
          </PopoverTrigger>

          <PopoverContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            align="center"
            side="bottom"
            style={{ width: inputWidth, height: "calc(100vh - 10rem)" }}
            className="mt-2 p-3 rounded-xl shadow-lg border z-200 overflow-auto"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <PopOverContentSearchContainer searchTerm={searchTerm}>
                {products!.map((product) => (
                  <SearchedProductBox
                    key={product.id}
                    product={product}
                    onNavigate={() => setPopoverOpen(false)} // Close specific state
                  />
                ))}
              </PopOverContentSearchContainer>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
