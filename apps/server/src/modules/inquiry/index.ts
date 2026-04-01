// src/modules/product-reviews/index.ts
import { Module } from "@medusajs/framework/utils"
import InuquiryService from "./service"

export const INQUIRY_MODULE = "inquiry"

export default Module(INQUIRY_MODULE, {
  service: InuquiryService,
})
