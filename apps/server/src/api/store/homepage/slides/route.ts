import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  linkUrl: string;
  order: number;
  image: string | null;
  isActive: boolean;
  altText?: string;
}

export interface SlidesResponse {
  slides: Slide[];
}
// Configuration from environment variables
const STRAPI_API_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_KEY;
const buildImageUrl = (img: any) => {
  if (!img?.url) return null;
  // If relative, prepend public URL
  return {
    ...img,
    url: img.url.startsWith("http")
      ? img.url
      : `http://localhost:1337${img.url}`,
  };
};
/**
 * GET /store/homepage/slides
 * Fetches active slides from Strapi Homepage single type
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const strapiEndpoint = `${STRAPI_API_URL}/homepage?populate[slides][populate][0]=image`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add auth token if configured
    if (STRAPI_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
    }

    const response = await fetch(strapiEndpoint, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Strapi request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Safely extract slides array
    const rawSlides = data.data?.slides || [];

    // Transform, filter, and sort slides
    const slides: Array<Slide> = rawSlides
      // Filter out inactive slides
      .filter((slide: Slide) => slide.isActive !== false)
      // Sort by order field (ascending)
      .sort((a: Slide, b: Slide) => (a.order || 0) - (b.order || 0))
      // Transform to clean format
      .map((slide: Slide) => ({
        id: slide.id,
        title: slide.title || "",
        subtitle: slide.subtitle || "",
        linkUrl: slide.linkUrl || "#",
        order: slide.order || 0,
        image: buildImageUrl(slide.image),
        altText: slide.altText || slide.title || "",
      }));

    res.json({ slides });
  } catch (error) {
    console.error("Error fetching homepage slides from Strapi:", error);
    res.status(500).json({
      error: "Failed to fetch slides",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
