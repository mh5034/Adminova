import { redirect } from "next/navigation";

import { ProductForm } from "@/components/products/product-form";
import { getUserRole } from "@/lib/auth/get-user-role";

export default async function NewProductPage() {
  const role = await getUserRole();

  if (role !== "admin") {
    redirect("/products");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Product</h1>

        <p className="text-sm text-muted-foreground">
          Create a new product in your inventory.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
