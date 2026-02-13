"use client"

import { useState, useRef, useEffect } from "react"
import { authenticateWithPhone, verifyOtp } from "../../../../lib/data/customer"
import ErrorMessage from "../../../checkout/components/error-message"
import { Input } from "@lib/components/ui/input"
import { useCustomer } from "@lib/context/customer-context"
import { ChevronRight } from "lucide-react"

type Props = {
  phone: string
  onBack: () => void
}

export const Otp = ({ phone, onBack }: Props) => {
  const [otp, setOtp] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const { refreshCustomer } = useCustomer()

  const handleSubmit = async () => {
    setIsLoading(true)
    const response = await verifyOtp({
      otp,
      phone,
    })
    setOtp("")
    setIsLoading(false)
    if (response.success) {
      await refreshCustomer()
    }
    if (typeof response === "string") {
      setError(response)
    }
  }

  const handleResend = async () => {
    authenticateWithPhone(phone)
    setCountdown(120)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    const numericValue = pastedData.replace(/\D/g, "").slice(0, 6)

    if (numericValue) {
      setOtp(numericValue)
      // Focus the input after the last pasted character
      const focusIndex = Math.min(numericValue.length, 5)
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus()
      }, 0)
    }
  }

  useEffect(() => {
    // Focus first input on initial render
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (otp.length !== 6 || isLoading) {
      return
    }
    handleSubmit()
  }, [otp, isLoading])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className="max-w-sm w-full flex flex-col gap-8 items-center border rounded-sm px-8 py-12"
      data-testid="otp-page"
    >
      <div className="relative h-8 w-full">
        <div className="flex flex-col justify-center items-center h-8">
          <button
            type="button"
            onClick={onBack}
          >
            <ChevronRight className="absolute right-0 cursor-pointer" />
          </button>
          <img
            width={90}
            loading="lazy"
            src="https://www.technolife.com/image/static_logo_techno_new.svg"
            alt="logo"
          />
        </div>
      </div>
      <div className="flex justify-start w-full">
        <h6 className="font-bold">کد تایید را وارد کنید</h6>
      </div>
      <div className="flex justify-start w-full text-xs text-gray-500">
        <span>کد تایید برای شماره</span>
        <span className="px-2 font-black">{phone}</span>
        <span>پیامک شد</span>
      </div>

      {/* Force LTR direction for OTP inputs only */}
      <div className="flex gap-2" dir="ltr">
        {[...Array(6)].map((_, index) => {
          return (
            <Input
              key={index}
              type="text"
              maxLength={1}
              inputMode="numeric"
              disabled={isLoading}
              className="w-10 h-10 text-center"
              dir="ltr" // Ensure each input is LTR
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              onPaste={handlePaste}
              value={otp[index] || ""}
              onChange={(e) => {
                const value = e.target.value

                // Only allow single digit
                if (value && !/^\d$/.test(value)) {
                  return
                }

                setOtp((prev) => {
                  const newOtp = prev.split("")
                  newOtp[index] = value
                  return newOtp.join("")
                })

                // Auto-focus next input after entering a digit
                if (value && index < 5) {
                  inputRefs.current[index + 1]?.focus()
                }
              }}
              onKeyDown={(e) => {
                // Move to previous input on backspace if current is empty
                if (
                  e.key === "Backspace" &&
                  !e.currentTarget.value &&
                  index > 0
                ) {
                  inputRefs.current[index - 1]?.focus()
                }
              }}
            />
          )
        })}
      </div>

      <ErrorMessage error={error} />
      <div className="flex items-center gap-x-2">
        <button
          className="text-small-regular cursor-pointer disabled:cursor-not-allowed"
          onClick={handleResend}
          disabled={countdown > 0}
        >
          {countdown > 0
            ? `${countdown} ثانیه مانده تا دریافت مجدد کد`
            : "دریافت مجدد کد"}
        </button>
      </div>
    </div>
  )
}
