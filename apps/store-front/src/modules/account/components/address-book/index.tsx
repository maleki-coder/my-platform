import React from "react"

import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer | null,
  showAddresses: boolean
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, showAddresses }) => {
  const { addresses } = customer!
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 flex-1">
        <AddAddress addresses={addresses} />
        {showAddresses && addresses.map((address) => {
          return (
            <EditAddress address={address} key={address.id} />
          )
        })}
      </div>
    </div>
  )
}

export default AddressBook
