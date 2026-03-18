import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";
    const strapiToken = process.env.STRAPI_API_KEY;

    if (!strapiToken) {
      return res.status(500).json({
        message: "STRAPI_API_TOKEN is not defined in environment variables.",
      });
    }
    const params = new URLSearchParams();
    params.append(
      "populate[blocks][on][blocks.hero-slider][populate][hero_slider][populate]",
      "image",
    );
    params.append(
      "populate[blocks][on][blocks.product-category-showcase][populate]",
      "*",
    );
    params.append(
      "populate[blocks][on][blocks.category-grid][populate][cards][populate]",
      "image",
    );
    params.append(
      "populate[blocks][on][blocks.multiple-banner][populate][banners][populate]",
      "image",
    );
    const queryParams = params.toString();
    const endpoint = `${strapiUrl}/api/homepage?${queryParams}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Strapi Error: ${response.statusText} | Details: ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      homepage: data.data,
    });
  } catch (error: any) {
    console.error("Error fetching homepage from Strapi:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch homepage data.",
      error: error.message,
    });
  }
}
