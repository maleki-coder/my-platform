"use client"

import React, { useEffect, useActionState, useState } from "react"

import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"
import { Button } from "@lib/components/ui/button"
import { Spinner } from "@lib/components/ui/spinner"
import { Input } from "@lib/components/ui/input"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const initialState = { success: false, error: null }
  const [successState, setSuccessState] = useState(false)
  const [state, formAction, pending] = useActionState(
    async (_currentState: any, formData: any) => {
      const phone = formData.get("phone") as string
      try {
        await updateCustomer({ phone })
        return { success: true, error: null }
      } catch (err: any) {
        return { success: false, error: err.toString() }
      }
    },
    initialState
  )

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])
  return (
    <AccountInfo
      label="تلفن همراه"
      currentInfo={`${customer.phone}`}
      isSuccess={successState}
      isError={!!state.error}
      errorMessage={state.error}
      clearState={clearState}
      data-testid="account-phone-editor"
    >
      <form action={formAction} className="w-full">
        <div className="grid grid-cols-1 gap-y-2">
          {/* <Label htmlFor="Phone">تلفن همراه</Label> */}
          <Input
            id="Phone"
            name="phone"
            required
            autoComplete="phone"
            defaultValue={customer.phone ?? ""}
            data-testid="phone-input"
          />
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

export default ProfileEmail
