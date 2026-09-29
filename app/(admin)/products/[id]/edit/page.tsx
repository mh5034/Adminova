import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/products/product-form";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/get-user-role";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  const role = await getUserRole();

  if (role !== "admin") {
    redirect("/products");
  }

  if (error || !product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
        <h1 className="text-2xl font-semibold">Edit Product</h1>

        <p className="text-sm text-muted-foreground">
          Update product information and inventory.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
