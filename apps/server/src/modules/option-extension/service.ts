import { MedusaService } from "@medusajs/framework/utils";
import { OptionExtension } from "./models/option-extension";

class OptionExtensionService extends MedusaService({
  OptionExtension,
}) {}

export default OptionExtensionService;
