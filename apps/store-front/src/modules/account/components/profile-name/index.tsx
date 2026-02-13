"use client"

import React, { useEffect, useActionState, useState } from "react"

import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"
import { Label } from "@lib/components/ui/label"
import { Input } from "@lib/components/ui/input"
import { Button } from "@lib/components/ui/button"
import { Spinner } from "@lib/components/ui/spinner"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileName: React.FC<MyInformationProps> = ({ customer }) => {
  const initialState = { success: false, error: null }
  const [successState, setSuccessState] = useState(false)
  const [state, formAction, pending] = useActionState(
    async (_currentState: any, formData: any) => {
      const first_name = formData.get("first_name") as string
      const last_name = formData.get("last_name") as string

      try {
        await updateCustomer({ first_name, last_name })
        return { success: true, error: null }
      } catch (err: any) {
        return { success: false, error: err.toString() }
      }
    },
    initialState
  )

  const clearState = () => {
    setSuccessState(false) // reset success so panel can toggle again
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])
  const formId = "profile-form"
  return (
    <AccountInfo
      label="نام و نام خانوادگی"
      currentInfo={`${customer.first_name} ${customer.last_name}`}
      isSuccess={successState}
      isError={!!state?.error}
      clearState={clearState}
      data-testid="account-name-editor"
    >
      <form id={formId} action={formAction} className="w-full overflow-visible">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">نام</Label>
            <Input
              id="first_name"
              name="first_name"
              required
              autoComplete="first_name"
              defaultValue={customer.first_name || undefined}
              data-testid="first-name-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">نام خانوادگی</Label>
            <Input
              id="last_name"
              name="last_name"
              required
              autoComplete="last_name"
              defaultValue={customer.last_name || undefined}
              data-testid="last-name-input"
            />
          </div>
        </div>
        <div className="flex items-center justify-end mt-2">
          <Button
            className="cursor-pointer"
            type="submit"
            data-testid="save-button"
          >
            {pending ? <Spinner /> : "ذخیره"}
          </Button>
        </div>
      </form>
    </AccountInfo>
  )
}

export default ProfileName
