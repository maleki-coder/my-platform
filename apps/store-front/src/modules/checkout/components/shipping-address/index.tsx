"use client"
import { HttpTypes } from "@medusajs/types"
import React, { useEffect, useState } from "react"
import AddressSelect from "../address-select"

const ShippingAddress = ({
  customer,
  cart,
  onSelectChanged,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  onSelectChanged: (checked: boolean) => void
}) => {
  // Instead of using dot notation, prepare the data differently
  const [addressData, setAddressData] = useState({
    first_name: cart?.shipping_address?.first_name || "",
    last_name: cart?.shipping_address?.last_name || "",
    address_1: cart?.shipping_address?.address_1 || "",
    address_2: cart?.shipping_address?.address_2 || "",
    company: cart?.shipping_address?.company || "",
    postal_code: cart?.shipping_address?.postal_code || "",
    city: cart?.shipping_address?.city || "",
    country_code: cart?.shipping_address?.country_code || "",
    province: cart?.shipping_address?.province || "",
    phone: cart?.shipping_address?.phone || "",
    id: cart?.shipping_address?.id || "",
  })

  const [email, setEmail] = useState(cart?.email || "")

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    if (address) {
      setAddressData({
        first_name: address?.first_name || "",
        last_name: address?.last_name || "",
        address_1: address?.address_1 || "",
        address_2: address?.address_2 || "",
        company: address?.company || "",
        postal_code: address?.postal_code || "",
        city: address?.city || "",
        country_code: "ir",
        province: address?.province || "",
        phone: address?.phone || "",
        id: address?.id || "",
      })
    }

    const checked = address?.address_1 ? true : false
    onSelectChanged(checked)

    if (email) {
      setEmail(email)
    }
  }

  useEffect(() => {
    if (cart && cart.shipping_address) {
      setFormAddress(cart.shipping_address, cart?.email)
    }

    if (cart && !cart.email && customer?.email) {
      setEmail(customer.email)
    }
  }, [cart])

  return (
    <>
      {customer && customer.addresses.length > 0 && (
        <div className="flex flex-col w-full">
            <AddressSelect
              addresses={customer.addresses}
              addressInput={addressData as HttpTypes.StoreCartAddress}
              onSelect={setFormAddress}
            />
          {/* Use array-style names for nested objects */}
          {Object.entries(addressData).map(([key, value]) => (
            <input
              key={`shipping_address.${key}`}
              type="hidden"
              name={`shipping_address[${key}]`} // Use bracket notation
              value={value || ""}
            />
          ))}
          <input type="hidden" name="email" value={email || ""} />
        </div>
      )}
    </>
  )
}
export default ShippingAddress
