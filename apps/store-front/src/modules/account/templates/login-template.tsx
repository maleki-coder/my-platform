"use client"

import { useState } from "react"
import LoginPhone from "../components/login-phone"
import RegisterPhone from "@modules/account/components/register-phone"
export enum LOGIN_VIEW {
  REGISTER_PHONE = "register-phone",
  SIGN_IN_PHONE = "sign-in-phone",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN_PHONE)

  return (
    <div className="w-full flex py-8 mx-auto justify-center">
      {currentView === "register-phone" ? (
        <RegisterPhone setCurrentView={setCurrentView} />
      ) : (
        <LoginPhone setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate
