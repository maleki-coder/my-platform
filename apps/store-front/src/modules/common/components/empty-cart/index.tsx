"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@lib/components/ui/button"
import React from "react"

type Props = {
  close?: () => void
}

const EmptyCart: React.FC<Props> = ({ close }) => {
  return (
    <div className="flex pb-5 h-full flex-col gap-y-4 items-center justify-center">
      <span className="font-bold">سبد خرید شما خالیه! </span>
        <LocalizedClientLink href="/store">
          <Button className="cursor-pointer" onClick={close}>
            مشاهده محصولات
          </Button>
        </LocalizedClientLink>
    </div>
  )
}

export default EmptyCart
