"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { retrieveCustomer } from "@lib/data/customer"

type CustomerContextType = {
  customer: HttpTypes.StoreCustomer | null
  setCustomer: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreCustomer | null>
  >
  isLoading: boolean
  error: any
  refreshCustomer: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextType | null>(null)

type CustomerProviderProps = {
  children: React.ReactNode
}

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const refreshCustomer = async () => {
    try {
      setIsLoading(true)
      const c = await retrieveCustomer()
      setCustomer(c)
      setError(null)
    } catch (err) {
      setError(err)
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshCustomer()
  }, [])

  return (
    <CustomerContext.Provider
      value={{
        customer,
        setCustomer,
        isLoading,
        error,
        refreshCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => {
  const context = useContext(CustomerContext)

  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }

  return context
}
