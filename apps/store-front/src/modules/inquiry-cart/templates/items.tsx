"use client"

import { InquiryCartResponse } from "types/global"
import AddItemModal from "@modules/inquiry-cart/components/add-item"
import InquiryItemRow from "@modules/inquiry-cart/components/inquiry-item-row"

type ItemsTemplateProps = {
  cart?: InquiryCartResponse
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items || []

  return (
    <>
      {/* --- HEADER --- */}
      <div className="flex w-full items-center justify-between px-4 pb-4 md:px-3">
        <div className="flex items-center gap-x-1.5 xl:gap-x-3">
          <p className="text-sm font-bold xl:text-xl leading-5.5">
            لیست استعلام شما
          </p>
        </div>
        
        <div className="flex items-center">
           <AddItemModal />
        </div>
      </div>

      {/* --- ITEMS LIST --- */}
      <div>
        {items
          .sort((a, b) =>
            (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          )
          .map((item) => (
            // 🎯 Boom! Clean, pure, and hook-rule compliant!
            <InquiryItemRow key={item.id} item={item} />
          ))}
      </div>
    </>
  )
}

export default ItemsTemplate
