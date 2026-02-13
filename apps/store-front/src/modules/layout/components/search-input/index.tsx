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
import { useIsMobileNavigator } from "@lib/hooks/use-mobile-navigator"
import { SearchIcon, X } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog"

export default function HeaderSearchInput() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputWidth, setInputWidth] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const isMobile = useIsMobileNavigator()
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

  // Prevent toggle when clicking already-focused input
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (open && inputRef.current === document.activeElement) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Defer closing to allow the input's blur event to run,
      // so document.activeElement updates before we decide.
      setTimeout(() => {
        // If input is still focused after blur (rare), don't close.
        if (inputRef.current === document.activeElement) return
        setOpen(newOpen)
      }, 0)
      return
    }
    setOpen(newOpen)
  }
  if (error) {
    return <div>test</div>
  }
  if (isMobile) {
    return (
      <Dialog modal={true} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Search"
            className="flex items-center"
          >
            <SearchIcon />
          </button>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col p-0 h-screen min-w-full m-0 rounded-none z-1000"
        >
          <VisuallyHidden>
            <DialogTitle>جستجوی محصولات</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-center gap-3 p-4 border-b">
            <Input
              autoFocus
              value={searchTerm}
              placeholder="جستجو کنید"
              onChange={handleInputChange}
              className="flex-1"
            />
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close search"
                className="shrink-0 rounded-md p-2 hover:bg-muted transition"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>

          {/* Results */}
          <div className="flex-1 w-full overflow-auto p-3">
            <PopOverContentSearchContainer searchTerm={searchTerm}>
              {products?.map((product) => (
                <SearchedProductBox key={product.id} product={product} />
              ))}
            </PopOverContentSearchContainer>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Input
          className="min-w-160 h-12"
          ref={inputRef}
          value={searchTerm}
          placeholder="جستجو کنید"
          onChange={handleInputChange}
          onClick={handleInputClick}
        />
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="center"
        side="bottom"
        style={{ width: inputWidth, height: "calc(100vh - 10rem)" }}
        className="mt-2 p-3 rounded-xl shadow-lg border z-200 overflow-auto"
      >
        <PopOverContentSearchContainer searchTerm={searchTerm}>
          {products!.map((product) => (
            <SearchedProductBox key={product.id} product={product} />
          ))}
        </PopOverContentSearchContainer>
      </PopoverContent>
    </Popover>
  )
}
