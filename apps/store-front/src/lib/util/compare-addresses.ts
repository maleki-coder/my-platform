import { isEqual, pick } from "lodash"

export default function compareAddresses(address1: any, address2: any) {
  return isEqual(pick(address1, ["id"]), pick(address2, ["id"]))
}
