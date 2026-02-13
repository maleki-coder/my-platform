"use client"

import { authenticateWithPhone } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useState } from "react"
import "react-phone-number-input/style.css"
import { Otp } from "../otp"
import { useParams } from "next/navigation"
import { Button } from "@lib/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Label } from "@lib/components/ui/label"
import { Input } from "@lib/components/ui/input"
import { Spinner } from "@lib/components/ui/spinner"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const LoginPhone = ({ setCurrentView }: Props) => {
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [enterOtp, setEnterOtp] = useState(false)
  const { countryCode } = useParams() as { countryCode: string }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const response = await authenticateWithPhone(phone)
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
      data-testid="login-page"
    >
      <div className="relative h-8 w-full">
        <div className="flex flex-col justify-center items-center h-8">
          <img
            width={90}
            loading="lazy"
            src="https://www.technolife.com/image/static_logo_techno_new.svg"
            alt="logo"
          />
        </div>
      </div>
      <div className="flex justify-start w-full">
        <h6 className="font-bold">ورود در تکنولایف</h6>
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-y-2">
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
        {error && (
          <ErrorMessage error={error} data-testid="login-error-message" />
        )}
        <Button
          className="w-full mt-6 cursor-pointer"
          disabled={loading}
          type="submit"
          size="lg"
          variant="default"
        >
          ورود
          {loading && <Spinner />}
        </Button>
      </form>
      <span className="text-center text-sm mt-6 ">
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER_PHONE)}
          className="underline cursor-pointer"
          data-testid="register-button"
        >
          ثبت نام نکرده اید؟
        </button>
      </span>
    </div>
  )
}

export default LoginPhone
