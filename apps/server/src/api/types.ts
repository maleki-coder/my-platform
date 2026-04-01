export interface StrapiImage {
  alternativeText: string;
  caption: string;
  url: string;
  id: string;
}
export interface StrapiFooterResponse {
  data: {
    contactList: Array<{
      id: number;
      phone: string;
      email: string;
      address: string;
    }>;
    columns: Array<{
      id: number;
      title: string;
      links: Array<{ id: number; label: string; url: string }>;
    }>;
    socials: Array<{
      id: number;
      platform: string;
      url: string;
      image: StrapiImage;
    }>;
    certificates: Array<{
      image: StrapiImage
      name: string;
      url: string;
    }>;
  };
}