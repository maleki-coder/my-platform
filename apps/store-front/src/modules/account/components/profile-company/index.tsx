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

const ProfileCompany: React.FC<MyInformationProps> = ({ customer }) => {
  const initialState = { success: false, error: null }
  const [successState, setSuccessState] = useState(false)
  const [state, formAction, pending] = useActionState(
    async (_currentState: any, formData: any) => {
      const company_name = formData.get("company_name") as string
      try {
        await updateCustomer({ company_name })
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
  const formId = "company-form"
  return (
    <AccountInfo
      label="شرکت"
      currentInfo={`${customer.company_name}`}
      isSuccess={successState}
      isError={!!state.error}
      errorMessage={state.error}
      clearState={clearState}
      data-testid="account-company-editor"
    >
      <form id={formId} action={formAction} className="w-full">
        <div className="grid grid-cols-1 gap-y-2">
          {/* <Label htmlFor="Company">شرکت </Label> */}
          <Input
            id="Company"
            name="company_name"
            required
            autoComplete="company_name"
            defaultValue={customer.company_name ?? ""}
            data-testid="company-input"
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

export default ProfileCompany
