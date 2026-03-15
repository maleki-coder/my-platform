// src/api/store/footer/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { StoreFooterResponse, StrapiFooterResponse } from "../../types";

// ============================================================================
// ۳. منطق کنترلر (Controller Logic)
// ============================================================================
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<StoreFooterResponse | { message: string }>
) => {
  try {
    const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
    const STRAPI_TOKEN = process.env.STRAPI_API_KEY; // در صورت خصوصی بودن API

    // ساختار کوئری برای Populate کردن تمام کامپوننت‌های تو در تو در استرپی
    // این کوئری به استرپی می‌گوید که تصاویر و لینک‌های داخل ستون‌ها را هم برگرداند
    const queryParams = new URLSearchParams({
      "populate[columns][populate]": "links",
      "populate[socials]": "*",
      "populate[certificates][populate]": "image",
    }).toString();

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
      fetchOptions
    );

    if (!strapiRes.ok) {
    //   req.logger.error(`Strapi API error: ${strapiRes.statusText}`);
      return res.status(502).json({ message: "Failed to fetch footer data from CMS" });
    }

    const rawData = (await strapiRes.json()) as StrapiFooterResponse;
    const attributes = rawData.data?.attributes;

    if (!attributes) {
      return res.status(404).json({ message: "Footer data not found in CMS" });
    }

    // ============================================================================
    // ۴. تبدیل داده‌ها (Data Transformation) از فرمت استرپی به فرمت تمیز فرانت‌اند
    // ============================================================================
    const formattedResponse: StoreFooterResponse = {
      // بخش اول: ستون‌های لینک
      linkColumns: attributes.columns?.map((col) => ({
        title: col.title,
        links: col.links?.map((link) => ({
          label: link.label,
          url: link.url,
        })) || [],
      })) || [],

      // بخش دوم: اطلاعات تماس و شبکه‌های اجتماعی
      contactInfo: {
        phone: attributes.contactPhone,
        email: attributes.contactEmail,
        address: attributes.contactAddress,
        socialLinks: attributes.socials?.map((social) => ({
          platform: social.platform,
          url: social.url,
        })) || [],
      },

      // بخش سوم: لوگوها و گواهینامه‌ها
      certificates: attributes.certificates?.map((cert) => {
        // استخراج URL تصویر. اگر استرپی لوکال است، آدرس پایه به آن متصل می‌شود
        let imageUrl = cert.image?.data?.attributes?.url || null;
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `${STRAPI_URL}${imageUrl}`;
        }

        return {
          name: cert.name,
          imageUrl: imageUrl,
          altText: cert.image?.data?.attributes?.alternativeText || cert.name,
        };
      }) || [],
    };

    // بازگرداندن پاسخ نهایی به استورفرانت (Storefront)
    return res.status(200).json(formattedResponse);

  } catch (error) {
    // req.logger.error("Error in /store/footer custom route: " + error);
    return res.status(500).json({ message: "Internal server error while fetching footer" });
  }
};
