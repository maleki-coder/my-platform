import { Module } from "@medusajs/framework/utils";
import OptionExtensionService from "./service";

export const OPTION_EXTENSION_MODULE = "optionExtension";

export default Module(OPTION_EXTENSION_MODULE, {
  service: OptionExtensionService,
});

// Export linkable for link definitions
export const linkable = {
  optionExtension: {
    id: {
      linkable: "option_extension_id",
      primaryKey: "id",
      serviceName: OPTION_EXTENSION_MODULE,
      field: "optionExtension",
    },
  },
};
