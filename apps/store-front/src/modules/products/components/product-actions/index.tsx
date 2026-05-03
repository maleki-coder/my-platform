"use client"

// 1. External & React Imports
import { useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { ArrowLeft, ClipboardList, ShoppingCart } from "lucide-react"

// 2. Library & Context Imports
import { addToCart, addToInquiryCart, deleteFromInquiryCart, deleteLineItem } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { useProductSelection } from "@modules/products/components/product-selection-provider"

// 3. UI Components
import ProductPrice from "@modules/products/components/product-price"
import TimedDiscountBadge from "@modules/products/components/timed-discount-badge"
import ProductInStockInfo from "@modules/products/components/product-in-stock-info"
import ProductWarrantyInfo from "@modules/products/components/product-warranty-info"
import { InquiryCartResponse } from "types/global"
import AnimatedCartButton from "../animated-cart-product"

// --- Types & Constants ---

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  disabled?: boolean
  cart?:
  | (HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  })
  | null
  inquiryCart?: InquiryCartResponse | null
}

const BUTTON_BASE_CLASSES =
  "relative w-full h-12 text-sm text-white cursor-pointer font-bold shadow-md transition-all duration-300"

// --- Main Component ---

export default function ProductActions({
  product,
  disabled,
  cart,
  inquiryCart
}: ProductActionsProps) {
  // State & Hooks
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isPending, startTransition] = useTransition(); // Perfect for Next.js navigation!
  const countryCode = useParams().countryCode as string
  const router = useRouter()
  // Context
  const { selectedVariant, isValidVariant, inStock } = useProductSelection()

  // Derived Data
  const { variantPrice } = getProductPrice({ product, variantId: selectedVariant?.id })

  const hasValidTimedDiscount =
    variantPrice?.percentage_diff &&
    parseInt(variantPrice.percentage_diff) > 0 &&
    variantPrice?.ends_at
  // --- Cart Detection Logic ---
  const cartLineItem = cart?.items?.find(
    (item: any) => item.variant_id === selectedVariant?.id
  )
  const inquiryLineItem = inquiryCart?.items?.find(
    (item: any) => item.variant_id === selectedVariant?.id
  )

  const isActionDisabled = !!disabled || isAdding

  // --- Handlers ---

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null;
    setIsAdding(true);
    try {
      await addToCart({ variantId: selectedVariant.id, quantity: 1, countryCode });
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAdding(false); // ✅ Always runs!
    }
  };

  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cartLineItem?.id) return;
    setIsRemoving(true);
    try {
      await deleteLineItem(cartLineItem.id);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    } finally {
      setIsRemoving(false); // ✅ Fixes the infinite spinner!
    }
  };

  const handleAddToInquiryCart = async () => {
    if (!selectedVariant?.id) return null;
    setIsAdding(true);
    try {
      await addToInquiryCart({
        quantity: 1,
        product_id: product.id,
        variant_id: selectedVariant.id,
        product_handle: product.handle,
        thumbnail: product.thumbnail!,
        title: product.title,
      });
    } catch (err) {
      console.error("Failed to add to inquiry cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromInquiryCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inquiryLineItem?.id) return;

    setIsRemoving(true);
    try {
      await deleteFromInquiryCart(inquiryLineItem!.id); 
    } catch (err) {
      console.error("Failed to remove from inquiry cart:", err);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleNavigate = (type: "inquiry-cart" | "cart") => {
    // useTransition is the standard way to show loading states during Next.js routing!
    startTransition(() => {
      router.push(`/${type}`);
    });
  };

  const renderSkeletonButton = () => {
    return (
      <>
        <div className="md:block hidden">
          <div className={`${BUTTON_BASE_CLASSES} animate-pulse rounded-md bg-gray-300`} />
        </div>
        <div className="md:hidden block">
          <div className="fixed bottom-20 right-0 z-20 w-full border-t border-gray-300 bg-gray-100 px-6 py-4">
            <div className={`${BUTTON_BASE_CLASSES} animate-pulse rounded-md bg-gray-300`} />
          </div>
        </div>
      </>
    )
  }

  // --- Main Render ---

  return (
    <div className="sticky top-12 flex flex-col gap-y-6 rounded-2xl border-b border-gray-100 bg-white p-2 shadow-custom">
      {/* Discount Badge */}
      {inStock && isValidVariant && hasValidTimedDiscount && (
        <div className="border-b border-gray-100 pb-4">
          <TimedDiscountBadge
            startsAt={variantPrice.starts_at}
            endsAt={variantPrice.ends_at!}
          />
        </div>
      )}

      {/* Stock & Warranty Info */}
      <div className="flex flex-col gap-1">
        {/* We can show a skeleton for these too if you want, but for now they just hide until valid */}
        {isValidVariant && <ProductInStockInfo inStock={inStock} />}
        {isValidVariant && inStock && <ProductWarrantyInfo />}
      </div>

      {/* Price */}
      {inStock && isValidVariant && (
        <ProductPrice product={product} variant={selectedVariant} />
      )}

      {/* Actions */}
      <div className="border-t border-gray-100 pt-6">
        {/* LOGIC FIX: Check for validation first! */}
        {!isValidVariant ? (
          renderSkeletonButton()
        ) : inStock ? (
          <>
            <div className="md:flex hidden w-full">
              <AnimatedCartButton
                isInCart={!!cartLineItem}
                isAdding={isAdding}
                isNavigating={isPending}
                isRemoving={isRemoving}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
                onNavigate={() => handleNavigate('cart')}
                addLabel="افزودن به سبد خرید"
                navigateLabel="مشاهده سبد خرید"
                AddIcon={<ShoppingCart size={20} />}
                NavigateIcon={<ArrowLeft size={20} />}
                activeClasses="bg-slate-800 hover:bg-slate-700 text-white"
                inactiveClasses="bg-sky-900 hover:bg-sky-700 text-white" />
            </div>
            <div className="md:hidden flex w-full">
              <div className="fixed flex bottom-20 right-0 z-20 w-full border-t border-gray-300 bg-gray-100 px-6 py-4">
                <AnimatedCartButton
                  isInCart={!!cartLineItem}
                  isAdding={isAdding}
                  isNavigating={isPending}
                  isRemoving={isRemoving}
                  onAdd={handleAddToCart}
                  onRemove={handleRemoveFromCart}
                  onNavigate={() => router.push("/cart")}
                  addLabel="افزودن به سبد خرید"
                  navigateLabel="مشاهده سبد خرید"
                  AddIcon={<ShoppingCart size={20} />}
                  NavigateIcon={<ArrowLeft size={20} />}
                  activeClasses="bg-slate-800 hover:bg-slate-700 text-white"
                  inactiveClasses="bg-sky-900 hover:bg-sky-700 text-white" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="md:flex hidden w-full">
              <AnimatedCartButton
                isInCart={!!inquiryLineItem}
                isAdding={isAdding}
                isRemoving={isRemoving}
                isNavigating={isPending}
                onAdd={handleAddToInquiryCart}
                onRemove={handleRemoveFromInquiryCart}
                onNavigate={() => handleNavigate("inquiry-cart")}
                addLabel="افزودن به لیست استعلام"
                navigateLabel="مشاهده لیست استعلام"
                AddIcon={<ClipboardList size={20} />}
                NavigateIcon={<ArrowLeft size={20} />}
                activeClasses="bg-slate-800 hover:bg-slate-700 text-white"
                inactiveClasses="bg-blue-600 hover:bg-blue-500 text-white"
              />
            </div>
            <div className="md:hidden flex w-full">
              <div className="fixed bottom-20 right-0 z-20 w-full border-t border-gray-300 bg-gray-100 px-6 py-4">
                <AnimatedCartButton
                  isInCart={!!inquiryLineItem}
                  isAdding={isAdding}
                  isRemoving={isRemoving}
                  isNavigating={isPending}
                  onAdd={handleAddToInquiryCart}
                  onRemove={handleRemoveFromInquiryCart}
                  onNavigate={() => handleNavigate("inquiry-cart")}
                  addLabel="افزودن به لیست استعلام"
                  navigateLabel="مشاهده لیست استعلام"
                  AddIcon={<ClipboardList size={20} />}
                  NavigateIcon={<ArrowLeft size={20} />}
                  activeClasses="bg-slate-800 hover:bg-slate-700 text-white"
                  inactiveClasses="bg-blue-600 hover:bg-blue-500 text-white"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
