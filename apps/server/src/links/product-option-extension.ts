import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import OptionExtensionModule from "../modules/option-extension"

export default defineLink(
  {
    linkable: ProductModule.linkable.productOption,
    field: "id",
  },
  {
    linkable: OptionExtensionModule.linkable.optionExtension,
    field: "product_option_id",
  }
)
