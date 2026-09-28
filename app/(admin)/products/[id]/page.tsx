import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
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
            <h1 className="text-2xl font-semibold">{product.name}</h1>

            <p className="text-sm text-muted-foreground">
              View product information and inventory details.
            </p>
          </div>
        </div>

        <Button
          nativeButton={false}
          render={
            <Link href={`/products/${product.id}/edit`}>
              <Pencil className="size-4" />
              Edit product
            </Link>
          }
        />
      </div>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border p-6 lg:col-span-2">
          <h2 className="mb-6 text-lg font-semibold">Product information</h2>

          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Category</dt>
              <dd className="mt-1 font-medium">{product.category}</dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">Price</dt>
              <dd className="mt-1 font-medium">
                ${Number(product.price).toFixed(2)}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">Stock</dt>
              <dd className="mt-1 font-medium">{product.stock}</dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <Badge variant="outline">{product.status}</Badge>
              </dd>
            </div>
          </dl>

          <div className="mt-6 border-t pt-6">
            <p className="text-sm text-muted-foreground">Description</p>

            <p className="mt-2">
              {product.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Inventory card */}
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Inventory</h2>

          <div className="mt-6">
            <p className="text-3xl font-semibold">{product.stock}</p>

            <p className="text-sm text-muted-foreground">units in stock</p>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-muted-foreground">Last updated</p>

            <p className="mt-1 text-sm font-medium">
              {new Date(product.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
