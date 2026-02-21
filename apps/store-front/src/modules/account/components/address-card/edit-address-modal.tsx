"use client"

import React, { useEffect, useState, useActionState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
// import CountrySelect from "@modules/checkout/components/country-select"
import { HttpTypes } from "@medusajs/types"
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"
import { clx } from "@lib/util/clx"
import { Edit2Icon, Trash2Icon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lib/components/ui/dialog"
import { Button } from "@lib/components/ui/button"
import { Label } from "@lib/components/ui/label"
import { Input } from "@lib/components/ui/input"
import { Spinner } from "@lib/components/ui/spinner"

type EditAddressProps = {
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  // const [successState, setSuccessState] = useState(false)
  const {
    state: isOpen,
    open: openModal,
    close: closeModal,
  } = useToggleState(false)

  const [formState, formAction, isPending] = useActionState(
    updateCustomerAddress,
    {
      success: false,
      error: null,
      addressId: address.id,
    }
  )

  useEffect(() => {
    if (formState.success) {
      closeModal()
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clx(
          "border rounded-rounded p-5 min-h-18 h-full w-full flex justify-between items-center transition-colors",
          {
            "border-gray-900": isActive,
          }
        )}
        data-testid="address-container"
      >
        
          <div className="flex text-right gap-1 flex-wrap text-base-regular">
          <h1 className="text-base-semi" data-testid="address-name">
            {`${address.first_name} ` + `${address.last_name} - `}
          </h1>
          {address.company && (
            <p className="text-base-regular" data-testid="address-company">
              {address.company}
            </p>
          )}
            <span data-testid="address-province-country">
              {address.province && `${address.province} - `}
            </span>
            <span data-testid="address-city">
              {address.city && `${address.city} - `}
            </span>
            <span data-testid="address-address">
              {address.address_1 && `${address.address_1} - `}
            </span>
            <span data-testid="address-address_2">
              {address.address_2 && `${address.address_2} - `}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code && `${address.postal_code}`}
            </span>
          </div>
       
        <div className="flex items-center gap-x-4 justify-end">
          <button
            className="text-base-regular flex items-center gap-x-2"
            onClick={(e) => {
              openModal(), e.preventDefault()
            }}
            data-testid="address-edit-button"
          >
            <Edit2Icon size={16} className="text-blue-500 cursor-pointer" />
          </button>
          <button
            className="text-base-regular flex items-center gap-x-2"
            onClick={(e) => {
              removeAddress(), e.preventDefault()
            }}
            data-testid="address-delete-button"
          >
            {removing ? (
              <Spinner />
            ) : (
              <Trash2Icon className="text-red-500 cursor-pointer" size={16} />
            )}
          </button>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => (open ? openModal() : closeModal())}
      >
        <DialogContent
          className="sm:max-w-150 w-full max-h-[90vh] overflow-y-auto z-1000"
          data-testid="add-address-modal"
        >
          <DialogHeader>
            <DialogTitle className="text-right">تغییر آدرس</DialogTitle>
          </DialogHeader>
          <form action={formAction}>
            <div className="flex flex-col gap-y-4 py-4">
              <div className="grid grid-cols-2 gap-x-2">
                <div className="space-y-2">
                  <input type="hidden" name="addressId" value={address.id} />
                  <Label htmlFor="first_name">نام</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    required
                    defaultValue={address.first_name || undefined}
                    autoComplete="given-name"
                    data-testid="first-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">نام خانوادگی</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    required
                    autoComplete="family-name"
                    defaultValue={address.last_name || undefined}
                    data-testid="last-name-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">شرکت</Label>
                <Input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  defaultValue={address.company || undefined}
                  data-testid="company-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">استان</Label>
                <Input
                  id="province"
                  name="province"
                  required
                  autoComplete="address-level1"
                  defaultValue={address.province || undefined}
                  data-testid="state-input"
                />
              </div>
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">کد پستی</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    required
                    autoComplete="postal-code"
                    defaultValue={address.postal_code || undefined}
                    data-testid="postal-code-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">شهر</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    autoComplete="locality"
                    defaultValue={address.city || undefined}
                    data-testid="city-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_1">آدرس</Label>
                <Input
                  id="address_1"
                  name="address_1"
                  required
                  autoComplete="address-line1"
                  defaultValue={address.address_1 || undefined}
                  data-testid="address-1-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_2">آپارتمان ، واحد ، پلاک</Label>
                <Input
                  id="address_2"
                  name="address_2"
                  required
                  autoComplete="address-line2"
                  defaultValue={address.address_2 || undefined}
                  data-testid="address-2-input"
                />
              </div>

              {/* <div className="space-y-2">
              <Label htmlFor="country_code">کشور</Label>
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />
            </div> */}
              <div className="space-y-2">
                <Label htmlFor="phone">تلفن همراه</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  autoComplete="phone"
                  defaultValue={address.phone || undefined}
                  data-testid="phone-input"
                />
              </div>
              {formState.error && (
                <div
                  className="text-rose-500 text-small-regular py-2"
                  data-testid="address-error"
                >
                  {formState.error}
                </div>
              )}
            </div>
            <DialogFooter>
              <div className="flex gap-3 justify-end">
                <Button
                  type="reset"
                  variant="secondary"
                  onClick={closeModal}
                  className="cursor-pointer h-10"
                  data-testid="cancel-button"
                >
                  لغو
                </Button>
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={isPending}
                  data-testid="save-button"
                >
                  {isPending ? <Spinner /> : "ذخیره"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditAddress
