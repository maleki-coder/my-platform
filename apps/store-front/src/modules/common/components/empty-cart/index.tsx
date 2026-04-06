"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@lib/components/ui/button"
import React from "react"

type Props = {
  close?: () => void,
  title: string
}

const EmptyCart: React.FC<Props> = ({ close , title}) => {
  return (
    <div className="flex pb-5 h-full flex-col gap-y-4 items-center justify-center py-4">
      <span className="text-base font-semibold leading-4 text-gray-700">{title}</span>
        <LocalizedClientLink href="/">
          <Button className="cursor-pointer" onClick={close}>
            مشاهده محصولات
          </Button>
        </LocalizedClientLink>
    </div>
  )
}

export default EmptyCart
