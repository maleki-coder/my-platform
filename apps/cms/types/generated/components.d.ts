import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCategoryGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_category_grids';
  info: {
    displayName: 'CategoryGrid';
    icon: 'apps';
  };
  attributes: {
    cards: Schema.Attribute.Component<'homepage.category-card', true>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksHeroSlider extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_sliders';
  info: {
    displayName: 'HeroSlider';
    icon: 'bulletList';
  };
  attributes: {
    hero_slider: Schema.Attribute.Component<'homepage.hero-slide', true>;
  };
}

export interface BlocksMultipleBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_multiple_banners';
  info: {
    displayName: 'MultipleBanner';
    icon: 'dashboard';
  };
  attributes: {
    banners: Schema.Attribute.Component<'homepage.hero-slide', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksProductCategoryShowcase extends Struct.ComponentSchema {
  collectionName: 'components_homepage_product_category_showcases';
  info: {
    displayName: 'ProductCategoryShowcase';
    icon: 'dashboard';
  };
  attributes: {
    category_handle: Schema.Attribute.String & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel']> &
      Schema.Attribute.DefaultTo<'carousel'>;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<10>;
    search_param: Schema.Attribute.String;
    show_view_all: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['category', 'collection']> &
      Schema.Attribute.Required;
  };
}

export interface FooterCertificate extends Struct.ComponentSchema {
  collectionName: 'components_footer_certificates';
  info: {
    displayName: 'Certificate';
    icon: 'book';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface FooterContact extends Struct.ComponentSchema {
  collectionName: 'components_footer_contacts';
  info: {
    displayName: 'Contact';
    icon: 'book';
  };
  attributes: {
    address: Schema.Attribute.String;
    email: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface FooterLinkColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_link_columns';
  info: {
    displayName: 'LinkColumn';
    icon: 'cursor';
  };
  attributes: {
    links: Schema.Attribute.Component<'footer.link-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface FooterLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_footer_link_items';
  info: {
    displayName: 'LinkItem';
    icon: 'cursor';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    displayName: 'SocialLink';
    icon: 'cursor';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    platform: Schema.Attribute.Enumeration<
      ['linkedin', 'youtube', 'instagram', 'whatsapp', 'telegram']
    >;
    url: Schema.Attribute.String;
  };
}

export interface HomepageCategoryCard extends Struct.ComponentSchema {
  collectionName: 'components_homepage_category_cards';
  info: {
    displayName: 'CategoryCard';
    icon: 'apps';
  };
  attributes: {
    handle: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_homepage_hero_slides';
  info: {
    displayName: 'HeroSlide';
    icon: 'apps';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'> &
      Schema.Attribute.Required;
    is_active: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    link_url: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    canonical_url: Schema.Attribute.String;
    change_frequency: Schema.Attribute.Enumeration<
      ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
    > &
      Schema.Attribute.DefaultTo<'daily'>;
    keywords: Schema.Attribute.String;
    meta_json_extra: Schema.Attribute.JSON;
    og_description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    og_image: Schema.Attribute.Media<'images'>;
    og_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    prevent_indexing: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    priority: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0.5>;
    robots: Schema.Attribute.Enumeration<
      [
        'index, follow',
        'index, nofollow',
        'noindex, follow',
        'noindex, nofollow',
      ]
    > &
      Schema.Attribute.DefaultTo<'index, follow'>;
    schema_json: Schema.Attribute.JSON;
    seo_description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    seo_title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    twitter_card_type: Schema.Attribute.Enumeration<
      ['summary', 'summary_large_image', 'app', 'player']
    > &
      Schema.Attribute.DefaultTo<'summary_large_image'>;
    twitter_description: Schema.Attribute.Text;
    twitter_image: Schema.Attribute.Media<'images'>;
    twitter_title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.category-grid': BlocksCategoryGrid;
      'blocks.hero-slider': BlocksHeroSlider;
      'blocks.multiple-banner': BlocksMultipleBanner;
      'blocks.product-category-showcase': BlocksProductCategoryShowcase;
      'footer.certificate': FooterCertificate;
      'footer.contact': FooterContact;
      'footer.link-column': FooterLinkColumn;
      'footer.link-item': FooterLinkItem;
      'footer.social-link': FooterSocialLink;
      'homepage.category-card': HomepageCategoryCard;
      'homepage.hero-slide': HomepageHeroSlide;
      'shared.seo': SharedSeo;
    }
  }
}
