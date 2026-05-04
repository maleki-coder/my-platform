import { model } from "@medusajs/framework/utils";

export const OptionExtension = model.define("option_extension", {
  id: model.id().primaryKey(),
  is_main_character: model.boolean().default(false),
});
