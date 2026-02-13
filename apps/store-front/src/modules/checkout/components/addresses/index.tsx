"use client"

import { setAddresses } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useState } from "react"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import AddressBook from "@modules/account/components/address-book"
import { Button } from "@lib/components/ui/button"
import { CheckoutStepHeader } from "../checkout-step-header"
import { ChevronLeft, LocationEdit, Phone } from "lucide-react"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "address"
  const [checked, setChecked] = useState(false)
  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }
  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <CheckoutStepHeader isOpen={isOpen} title={"آدرس تحویل"} />
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="flex flex-wrap w-full gap-4 justify-end">
            <ShippingAddress
              customer={customer}
              onSelectChanged={setChecked}
              cart={cart}
            />
            <AddressBook customer={customer} showAddresses={false} />
            <Button
              disabled={!checked}
              type="submit"
              size={"sm"}
              className="cursor-pointer text-xs"
              data-testid="add-discount-button"
            >
              ادامه خرید
            </Button>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div className="text-small-regular">
          {cart && cart.shipping_address ? (
            <div className="flex justify-between mt-3 rounded-2xl border-none bg-indigo-50 px-8 py-5">
              <div className="flex max-w-[64%] items-center gap-6">
                <div className="flex w-full flex-col gap-y-1.5">
                  <div className="flex items-center gap-3 leading-9 xl:leading-7.5 text-sm font-medium text-gray-800">
                    <span>
                      <LocationEdit size={14} />
                    </span>
                    <span>{cart.shipping_address.address_1}</span>
                  </div>
                  <div className="flex items-center gap-3 leading-9 xl:leading-7.5 text-sm font-medium text-gray-800">
                    <span>
                      <Phone size={14} />
                    </span>
                    <span>{cart.shipping_address.phone}</span>
                  </div>
                </div>
              </div>
              <div className="text-gray-600 flex shrink-0! items-center cursor-pointer gap-1.5">
                {!isOpen && cart?.shipping_address && (
                  <>
                    <span
                      onClick={handleEdit}
                      className="inline-block text-sm leading-5 xl:text-sm"
                    >
                      ویرایش
                    </span>
                    <ChevronLeft size={18} />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <Spinner />
            </div>
          )}
        </div>
      )}
      <Divider className="mt-4" />
    </div>
  )
}

export default Addresses
