import { 
  ModuleProvider, 
  Modules,
} from "@medusajs/framework/utils"
import KavehNegarNotificationService from "./service"

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [KavehNegarNotificationService],
})