"use client"

import { InquiryCartResponse } from "types/global"
import AddItemModal from "@modules/inquiry-cart/components/add-item"
import InquiryItemRow from "@modules/inquiry-cart/components/inquiry-item-row"
import EmptyCartMessage from "@modules/inquiry-cart/components/empty-cart-message"

type ItemsTemplateProps = {
  cart?: InquiryCartResponse
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items || []
  return (
    <>
      {/* --- HEADER --- */}
      <div className="flex w-full items-center justify-between pb-4 md:ps-3">
        <div className="flex items-center gap-x-1.5 xl:gap-x-3">
          <p className="text-lg font-bold xl:text-xl leading-5.5">
            لیست استعلام شما
          </p>
        </div>

        <div className="flex items-center">
          <AddItemModal />
        </div>
      </div>

      {items.length ? (
        items
          .sort((a, b) =>
            (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          )
          .map((item) => (
            // Boom! Clean, pure, and hook-rule compliant!
            <InquiryItemRow key={item.id} item={item} />
          ))
      ) : (
        <EmptyCartMessage />
      )}
    </>
  )
}

export default ItemsTemplate
