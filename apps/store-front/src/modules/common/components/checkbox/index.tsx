import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  "data-testid"?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  "data-testid": dataTestId,
}) => {
  const reactId = React.useId()
  const id = name ? `${name}-checkbox` : `checkbox-${reactId}`

  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        type="checkbox"
        className="text-base-regular flex items-center gap-x-2"
        checked={checked}
        onChange={() => onChange?.()}
        name={name}
        data-testid={dataTestId}
        aria-checked={checked}
        // Avoid React warning for controlled input if no onChange was provided:
        readOnly={!onChange}
      />
      <label
        htmlFor={id}
        className="transform-none! !txt-medium"
      >
        {label}
      </label>
    </div>
  )
}

export default CheckboxWithLabel
