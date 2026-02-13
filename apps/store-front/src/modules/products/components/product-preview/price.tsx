// import { p, clx } from "@medusajs/ui"
import { clx } from "@lib/util/clx"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <p
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {price.original_price}
        </p>
      )}
      <p
        className={clx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </p>
    </>
  )
}
