import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react"
import { clx } from "@lib/util/clx"
import { ChevronDown } from "lucide-react"
import { Fragment } from "react"
import { InquiryCartCurrency } from "types/global"

type CurrencySelectProps = {
  value: InquiryCartCurrency
  onChange: (currency: InquiryCartCurrency) => void
}
const currencyTranslations: Record<InquiryCartCurrency, string> = {
  USD: "دلار آمریکا",
  CYN: "یوان چین",
  IRR: "تومان", // Sticking to Toman for Iranian B2B standard
}
const CurrencySelect = ({ value, onChange }: CurrencySelectProps) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <ListboxButton
          className="relative w-full cursor-pointer flex justify-between items-center px-3 h-9 text-right bg-white focus:outline-hidden border border-ui-border-base rounded-md hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-ui-border-interactive text-sm font-medium"
          data-testid="currency-select-button"
        >
          {({ open }) => (
            <>
              <span className="block truncate ml-2">
                {currencyTranslations[value]}
              </span>
              <ChevronDown
                size={16}
                className={clx("transition-transform duration-200 text-gray-500", {
                  "transform rotate-180": open,
                })}
              />
            </>
          )}
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions
            className="absolute z-20 w-full overflow-auto text-sm rounded-md mt-1 bg-white border border-gray-200 shadow-lg max-h-60 focus:outline-hidden right-0"
            data-testid="currency-select-options"
          >
            {(Object.keys(currencyTranslations) as InquiryCartCurrency[]).map((currency) => (
              <ListboxOption
                key={currency}
                value={currency}
                className={({ active }) =>
                  clx(
                    "cursor-pointer select-none relative py-2.5 px-3 text-right transition-colors",
                    {
                      "bg-gray-100 text-black": active,
                      "text-gray-700": !active,
                    }
                  )
                }
              >
                {({ selected }) => (
                  <span className={clx("block truncate", { "font-bold text-blue-600": selected, "font-normal": !selected })}>
                    {currencyTranslations[currency]}
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  )
}
export default CurrencySelect;