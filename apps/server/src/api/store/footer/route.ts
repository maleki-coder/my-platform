// src/api/store/footer/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { StrapiFooterResponse } from "../../types";

// ============================================================================
// ۳. منطق کنترلر (Controller Logic)
// ============================================================================
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<StrapiFooterResponse | { message: string }>,
) => {
  try {
    const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
    const STRAPI_TOKEN = process.env.STRAPI_API_KEY; // در صورت خصوصی بودن API

    // ساختار کوئری برای Populate کردن تمام کامپوننت‌های تو در تو در استرپی
    // این کوئری به استرپی می‌گوید که تصاویر و لینک‌های داخل ستون‌ها را هم برگرداند
    const params = new URLSearchParams();
    params.append("populate[columns][populate]", "links");
    params.append("populate[socials][populate]", "image");
    params.append("populate[certificates][populate]", "image");
    params.append("populate[contactList]", "*");

    const queryParams = params.toString();

    const fetchOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      // برای جلوگیری از دریافت داده‌های قدیمی توسط خود مدوسا
      cache: "no-store",
    };

    const strapiRes = await fetch(
      `${STRAPI_URL}/api/global-footer?${queryParams}`,
      fetchOptions,
    );

    if (!strapiRes.ok) {
      //   req.logger.error(`Strapi API error: ${strapiRes.statusText}`);
      return res
        .status(502)
        .json({ message: "Failed to fetch footer data from CMS" });
    }

    let rawData = (await strapiRes.json()) as StrapiFooterResponse;

    if (!rawData) {
      return res.status(404).json({ message: "Footer data not found in CMS" });
    }

    rawData = {
      ...rawData,
      data: {
        ...rawData.data,
        socials: rawData.data.socials?.map(
          (social: StrapiFooterResponse["data"]["socials"][number]) => ({
            ...social,
            image: {
              alternativeText: social.image.alternativeText,
              caption: social.image.caption,
              url:  `${STRAPI_URL}${social.image?.url}`,
              id: social.image.id
            },
          }),
        ),
        certificates: rawData.data.certificates?.map(
          (cert: StrapiFooterResponse["data"]["certificates"][number]) => ({
            image: {
              alternativeText: cert.image.alternativeText,
              caption: cert.image.caption,
              url:  `${STRAPI_URL}${cert.image?.url}`,
              id: cert.image.id
            },
            name: cert.name,
            url: cert.url,
          }),
        ),
      },
    };
    return res.status(200).json(rawData);
  } catch (error) {
    // req.logger.error("Error in /store/footer custom route: " + error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching footer" });
  }
};
