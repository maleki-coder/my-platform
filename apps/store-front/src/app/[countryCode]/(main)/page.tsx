import { Metadata } from "next"
import { fetchHomePageContent } from "@lib/data/homepage"
import { CategoryGridBlock } from "@modules/home/components/category-grid-block"
import { AllStrapiBlocks } from "types/global"
import ProductCategoryShowcaseBlock from "@modules/home/components/product-category-showcase-block"
import MultipleBannerBlock from "@modules/home/components/multiple-banner-block"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const renderBlock = (block: AllStrapiBlocks) => {
  switch (block.__component) {
    case "blocks.category-grid":
      return <CategoryGridBlock key={block.__component} data={block} />;
    case "blocks.product-category-showcase":
      return <ProductCategoryShowcaseBlock key={block.__component} data={block} countryCode={countryCode} />;
    case "blocks.multiple-banner":
      return <MultipleBannerBlock key={block.__component} data={block} />;
    default:
      return null;
  }
}

  const response = await fetchHomePageContent()
  const blocks = response?.homepage?.blocks as AllStrapiBlocks[]

  return (
    <div className="flex flex-col mx-auto w-full px-4 max-w-screen-2xl gap-8 md:gap-16 mt-8">
      {blocks?.map((block) => renderBlock(block))}
    </div>
  )
}
