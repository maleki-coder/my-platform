"use client"

import { useState } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { registerWithPhone } from "@lib/data/customer"
import "react-phone-number-input/style.css"
import { Otp } from "../otp"
import { useParams } from "next/navigation"
import { Button } from "@lib/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Input } from "@lib/components/ui/input"
import { Label } from "@lib/components/ui/label"
import { Spinner } from "@lib/components/ui/spinner"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const RegisterPhone = ({ setCurrentView }: Props) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [enterOtp, setEnterOtp] = useState(false)
  const { countryCode } = useParams() as { countryCode: string }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const response = await registerWithPhone({
      firstName,
      lastName,
      phone,
    })
    setLoading(false)
    if (typeof response === "string") {
      setError(response)
      return
    }

    setEnterOtp(true)
  }

  if (enterOtp) {
    return <Otp phone={phone} onBack={() => setEnterOtp(false)} />
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col gap-8 items-center border rounded-sm px-8 py-12 shadow-[0_4px_14px_-3px_rgba(0,0,0,0.22)]"
      data-testid="register-page"
    >
      <div className="relative h-8 w-full">
        <div className="flex flex-col justify-center items-center h-8">
          <ChevronRight
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN_PHONE)}
            className="absolute right-0 cursor-pointer"
          />
          <img
            width={90}
            loading="lazy"
            src="https://www.technolife.com/image/static_logo_techno_new.svg"
            alt="logo"
          />
        </div>
      </div>
      <form className="w-full flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="first_name"> نام</Label>
            <Input
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="last_name"> نام خانوادگی</Label>
            <Input
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">شماره موبایل</Label>
            <Input
              name="phone"
              required
              autoComplete="phone"
              data-testid="phone-input"
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault()
                }
              }}
              value={phone}
              onChange={(value) => setPhone(value.target.value)}
            />
          </div>
        </div>
        <ErrorMessage error={error} data-testid="register-error" />
        <Button
          className="w-full mt-6 cursor-pointer"
          type="submit"
          size="lg"
          variant="default"
          disabled={loading}
        >
          ثبت نام
          {loading && <Spinner />}
        </Button>
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          ثبت نام شما به معنای پذیرش{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            قوانین
          </LocalizedClientLink>{" "}
          و{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            شرایط{" "}
          </LocalizedClientLink>
          است.
        </span>
      </form>
      <span className="text-center text-sm">
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN_PHONE)}
          className="underline cursor-pointer"
          data-testid="register-button"
        >
          قبلا ثبت نام کرده اید؟
        </button>
      </span>
    </div>
  )
}

export default RegisterPhone
