

import { listCategories } from "@lib/data/categories";
import { SidebarPortal } from "@modules/layout/components/side-bar-portal";

export default async function SidebarWrapper() {
  const categories = await listCategories();
  return (
    <SidebarPortal categories={categories} />
  );
}
