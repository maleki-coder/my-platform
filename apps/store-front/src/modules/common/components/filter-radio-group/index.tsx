import { clx } from "@lib/util/clx"
// import { EllipseMiniSolid } from "@medusajs/icons"
// import { Label, RadioGroup, p, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <p className="txt-compact-small-plus text-ui-fg-muted">{title}</p>
      <div data-testid={dataTestId} onChange={handleChange}>
  {items?.map((i) => {
    const isSelected = i.value === value

    return (
      <div
        key={i.value}
        className={clx("flex gap-x-2 items-center", {
          "ml-[-23px]": isSelected,
        })}
      >
        {/* Selected Icon */}
        {/* {isSelected && <EllipseMiniSolid />} */}

        {/* Native Radio Input */}
        <input
          type="radio"
          id={i.value}
          name="radio-group"
          value={i.value}
          checked={isSelected}
          onChange={() => handleChange(i.value)}
          className="hidden peer"
        />

        {/* Label */}
        <label
          htmlFor={i.value}
          className={clx(
            "!txt-compact-small transform-none! text-ui-fg-subtle hover:cursor-pointer",
            {
              "text-ui-fg-base": isSelected,
            }
          )}
          data-testid="radio-label"
          data-active={isSelected}
        >
          {i.label}
        </label>
      </div>
    )
  })}
</div>
    </div>
  )
}

export default FilterRadioGroup
