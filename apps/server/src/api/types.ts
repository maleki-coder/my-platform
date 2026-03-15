export interface StrapiImage {
  data: {
    attributes: {
      url: string;
      alternativeText: string | null;
    };
  } | null;
}

export interface StrapiFooterResponse {
  data: {
    attributes: {
      contactPhone: string | null;
      contactEmail: string | null;
      contactAddress: string | null;
      columns: Array<{
        id: number;
        title: string;
        links: Array<{ id: number; label: string; url: string }>;
      }>;
      socials: Array<{ id: number; platform: string; url: string }>;
      certificates: Array<{
        id: number;
        name: string;
        image: StrapiImage;
      }>;
    };
  };
}

export interface StoreFooterResponse {
  linkColumns: Array<{
    title: string;
    links: Array<{ label: string; url: string }>;
  }>;
  contactInfo: {
    phone: string | null;
    email: string | null;
    address: string | null;
    socialLinks: Array<{ platform: string; url: string }>;
  };
  certificates: Array<{
    name: string;
    imageUrl: string | null;
    altText: string | null;
  }>;
}
