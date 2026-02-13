"use client";

interface QuickAccessLink {
  title: string;
  href: string;
  external?: boolean;
}

const links: QuickAccessLink[] = [
  { title: "بلاگ", href: "https://www.technolife.com/blog", external: true },
  { title: "خرید گوشی", href: "/product/list/69_800_801/%D8%AA%D9%85%D8%A7%D9%85%DB%8C-%DA%AF%D9%88%D8%B4%DB%8C%E2%80%8C%D9%87%D8%A7" },
  { title: "گوشی سامسونگ", href: "/product/list/69_70_77/%DA%AF%D9%88%D8%B4%DB%8C-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D8%B3%D8%A7%D9%85%D8%B3%D9%88%D9%86%DA%AF-samsung" },
  { title: "گوشی آیفون", href: "/product/list/69_70_73/%DA%AF%D9%88%D8%B4%DB%8C-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D8%A7%D9%BE%D9%84-apple" },
  { title: "گوشی شیائومی", href: "/product/list/69_70_79/%DA%AF%D9%88%D8%B4%DB%8C-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D8%B4%DB%8C%D8%A7%D8%A6%D9%88%D9%85%DB%8C-xiaomi" },
  { title: "گوشی پوکو", href: "/product/list/69_70_799/%DA%AF%D9%88%D8%B4%DB%8C-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D9%BE%D9%88%DA%A9%D9%88-poco" },
  { title: "مقایسه گوشی", href: "/compare" },
  { title: "خرید لپ تاپ", href: "/product/list/164_163_130/%D8%AA%D9%85%D8%A7%D9%85%DB%8C-%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1%D9%87%D8%A7-%D9%88-%D9%84%D9%BE-%D8%AA%D8%A7%D9%BE-%D9%87%D8%A7" },
  { title: "هندزفری بلوتوثی", href: "/product/list/31_157_531/%D8%AA%D9%85%D8%A7%D9%85-%D9%87%D8%AF%D9%81%D9%88%D9%86-%D9%87%D8%A7-%D9%88-%D9%87%D9%86%D8%AF%D8%B2%D9%81%D8%B1%DB%8C-%D9%87%D8%A7" },
  { title: "لپ تاپ ایسوس", href: "https://www.technolife.com/product/list/164_163_825/%DA%A9%D8%A7%D9%85%D9%BE%DB%8C%D9%88%D8%AA%D8%B1-%D9%88-%D9%84%D9%BE-%D8%AA%D8%A7%D9%BE-%D8%A7%DB%8C%D8%B3%D9%88%D8%B3-asus", external: true },
];
interface Props {
    title :string
}
export default function QuickAccessNav({title}: Props) {
  return (
    <nav className="w-full pt-12 2xl:w-auto 2xl:pt-0">
      <strong className="text-xl font-semibold leading-8">{title}</strong>
      <div className="pt-6 flex flex-col">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target={link.external ? "_blank" : "_self"}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="block pb-3 text-sm font-medium leading-5.5 text-gray-200 hover:text-white transition-colors"
          >
            {link.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
