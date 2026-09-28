import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/products/product-form";

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

  if (error || !product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
