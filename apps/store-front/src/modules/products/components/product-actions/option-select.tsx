import { clx } from "@lib/util/clx"
import { HttpTypes } from "@medusajs/types"
import React, { useMemo } from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  variants: HttpTypes.StoreProductVariant[]
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  variants, // ✨ Receive variants
  "data-testid": dataTestId,
  disabled,
}) => {
  // ✨ Extract only the values that actually exist inside a valid variant
  const filteredOptions = useMemo(() => {
    // 1. Create a Set of valid values for THIS specific option.id across all variants
    const validValues = new Set<string>()
    
    variants.forEach((variant) => {
      variant.options?.forEach((varOpt) => {
        // @ts-ignore - Depending on your Medusa version, this might be option_id or id
        const optId = varOpt.option_id || varOpt.id 
        if (optId === option.id && varOpt.value) {
          validValues.add(varOpt.value)
        }
      })
    })

    // 2. Map the original option values and filter out the ones not in our Set
    return (option.values ?? [])
      .map((v) => v.value)
      .filter((val) => val && validValues.has(val))
  }, [option, variants])

  // ✨ If this option group has no valid variant values, don't render it at all!
  if (filteredOptions.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-sm font-medium">{title} : {current}</span>
      <div
        className="flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v as string)}
              key={v}
              className={clx(
                "border cursor-pointer text-xs font-medium rounded-md px-3 py-1.5 transition-all duration-200 min-w-15",
                {
                  "shadow-sm border-black": v === current,
                  "": v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
