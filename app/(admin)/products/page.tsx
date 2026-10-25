import { ProductsPageClient } from "@/components/products/products-page-client";
import { getUserRole } from "@/lib/auth/get-user-role";

export default async function ProductsPage() {
  const role = await getUserRole();

  return <ProductsPageClient canManage={role === "admin"} />;
}
