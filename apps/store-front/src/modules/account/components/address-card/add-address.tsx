"use client"
import { useEffect, useActionState } from "react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { addCustomerAddress } from "@lib/data/customer"
import { PlusIcon } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog"
import { Button } from "@lib/components/ui/button"
import { Label } from "@lib/components/ui/label"
import { Input } from "@lib/components/ui/input"
import { Spinner } from "@lib/components/ui/spinner"

const AddAddress = ({
  addresses,
}: {
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const {
    state: isOpen,
    open: openModal,
    close: closeModal,
  } = useToggleState(false)

  const [formState, formAction, isPending] = useActionState(
    addCustomerAddress,
    {
      isDefaultShipping: addresses.length === 0,
      success: false,
      error: null,
    }
  )

  useEffect(() => {
    if (formState.success) {
      closeModal()
    }
  }, [formState])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? openModal() : closeModal())}
    >
      <DialogTrigger asChild>
        <button
          className="border text-blue-400 rounded-rounded p-5 min-h-18 h-full cursor-pointer w-full flex justify-between items-center"
          data-testid="add-address-button"
        >
          <span className="text-base-semi">افزودن آدرس جدید</span>
          <PlusIcon />
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-150 w-full max-h-[90vh] overflow-y-auto z-1000"
        data-testid="add-address-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-right">آدرس جدید</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="flex flex-col gap-y-4 py-4">
            <div className="grid grid-cols-2 gap-x-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">نام</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  required
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
                data-testid="address-2-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">تلفن همراه</Label>
              <Input
                id="phone"
                name="phone"
                required
                autoComplete="phone"
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
  )
}

export default AddAddress
