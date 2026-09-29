import { redirect } from "next/navigation";

import { ProductForm } from "@/components/products/product-form";
import { getUserRole } from "@/lib/auth/get-user-role";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const role = await getUserRole();

  if (role !== "admin") {
    redirect("/products");
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        nativeButton={false}
        render={
          <Link href="/products">
            <ArrowLeft className="size-4" />
            Back to products
          </Link>
        }
      />

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
