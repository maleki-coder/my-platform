"use client"

import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { Button } from "@lib/components/ui/button"
import { Input } from "@lib/components/ui/input"
import { Spinner } from "@lib/components/ui/spinner"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [isApplying, setIsApplying] = React.useState(false)
  const [removingCode, setRemovingCode] = React.useState<string | null>(null)

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    if (removingCode) return

    setRemovingCode(code)

    try {
      const validPromotions = promotions
        .filter((promotion) => promotion.code && promotion.code !== code)
        .map((p) => p.code!)

      await applyPromotions(validPromotions)
    } finally {
      setRemovingCode(null)
    }
  }

  const addPromotionCode = async (formData: FormData) => {
    if (isApplying) return

    setIsApplying(true)
    setErrorMessage("")

    try {
      const code = formData.get("code")
      if (!code) throw new Error("کد تخفیف وارد نشده است")

      const codes = promotions.filter((p) => p.code).map((p) => p.code!)

      codes.push(code.toString())

      await applyPromotions(codes)

      const input = document.getElementById(
        "promotion-input"
      ) as HTMLInputElement
      if (input) input.value = ""
    } catch (e: any) {
      setErrorMessage(e.message || "خطا در اعمال کد تخفیف")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="flex flex-col rounded-2xl p-4 shadow-custom">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addPromotionCode(new FormData(e.currentTarget))
        }}
        className="w-full"
      >
        <div className="flex gap-x-1 mb-2 items-center">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            size={"lg"}
            className="cursor-pointer hover:bg-sky-700 bg-sky-900 text-xs"
            data-testid="add-discount-button"
          >
            کد تخفیف دارید؟
          </Button>
        </div>

        {isOpen && (
          <>
            <div className="flex w-full gap-x-2">
              <Input
                className="h-10 w-4/5"
                id="promotion-input"
                name="code"
                type="text"
                autoFocus={false}
                data-testid="discount-input"
              />
              <Button
                type="submit"
                size={"lg"}
                disabled={isApplying}
                className="cursor-pointer hover:bg-sky-700 bg-sky-900 text-xs w-1/5"
                data-testid="discount-apply-button"
              >
                {isApplying ? <Spinner /> : "اعمال"}
              </Button>
            </div>

            <ErrorMessage
              error={errorMessage}
              data-testid="discount-error-message"
            />
          </>
        )}
      </form>

      {promotions.length > 0 && (
        <div className="w-full flex items-center">
          <div className="flex flex-col w-full">
            <h1 className="text-xs my-2">کدهای تخفیف اعمال شده</h1>

            {promotions.map((promotion) => {
              return (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between w-full gap-x-2 max-w-full mb-2"
                  data-testid="discount-row"
                >
                  <div className="gap-x-1 text-xs flex items-center w-4/5 h-10 border rounded-md px-4">
                    <span className="truncate" data-testid="discount-code">
                      <p color={promotion.is_automatic ? "green" : "grey"}>
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? ` (${promotion.application_method.value}%) `
                                : ` (${convertToLocale({
                                    amount: +promotion.application_method.value,
                                  })} ${"تومان"}) `}
                            </>
                          )}
                        {promotion.code}
                      </p>
                    </span>
                  </div>
                  {!promotion.is_automatic && (
                    <Button
                      size={"lg"}
                      className="flex items-center cursor-pointer w-1/5 bg-red-50 text-red-600 hover:bg-red-100"
                      onClick={() => {
                        if (!promotion.code) {
                          return
                        }

                        removePromotionCode(promotion.code)
                      }}
                      data-testid="remove-discount-button"
                    >
                      {removingCode ? <Spinner /> : <Trash size={14} />}
                    </Button>
                  )}
                  {promotion.is_automatic && <div className="w-1/5"></div>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountCode
