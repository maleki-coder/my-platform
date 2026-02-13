"use client"
import { useCustomer } from "@lib/context/customer-context"
import LoginRegisterButton from "../login-register-button"
import { UserProfileButton } from "../user-profile-button"

export const UserStatusButton = () => {
  const { customer, isLoading, error } = useCustomer()

  let content: React.ReactNode

  if (isLoading || error || !customer) {
    content = <LoginRegisterButton />
  } else {
    content = <UserProfileButton />
  }

  return (
    <div className="flex h-content p-2 rounded-md shadow-[0_4px_14px_-3px_rgba(0,0,0,0.22)] cursor-pointer items-center justify-center">
      {content}
    </div>
  )
}
