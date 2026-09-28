import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageIcon, Pencil } from "lucide-react";

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
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, name, category, price, status, image_url")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  const { data: activities } = await supabase
    .from("product_activities")
    .select("*")
    .eq("product_id", id)
    .order("created_at", {
      ascending: false,
    });

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

          {/* Product image + information */}
          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            {/* Product image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageIcon className="size-10" />

                  <span className="text-sm">No product image</span>
                </div>
              )}
            </div>

            {/* Product fields */}
            <div>
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
      {/* Activity history */}
      <div className="rounded-lg border p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Activity history</h2>

          <p className="text-sm text-muted-foreground">
            Recent changes made to this product.
          </p>
        </div>

        {activities && activities.length > 0 ? (
          <div className="space-y-0">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {/* Timeline line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-1.75 top-4 h-full w-px bg-border" />
                )}

                {/* Timeline dot */}
                <div className="relative z-10 mt-1.5 size-4 shrink-0 rounded-full border-4 border-background bg-primary" />

                <div>
                  <p className="font-medium">{activity.description}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No activity recorded yet.
            </p>
          </div>
        )}
      </div>
      {/* Related products */}
      <div className="rounded-lg border p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Related products</h2>
          <p className="text-sm text-muted-foreground">
            Other products in the {product.category} category.
          </p>
        </div>

        {relatedProducts && relatedProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                className="group overflow-hidden rounded-lg border transition-colors hover:bg-muted/50"
              >
                <div className="relative aspect-video bg-muted">
                  {relatedProduct.image_url ? (
                    <Image
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ImageIcon className="size-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-4">
                  <p className="truncate font-medium">{relatedProduct.name}</p>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      ${Number(relatedProduct.price).toFixed(2)}
                    </p>

                    <Badge variant="outline">{relatedProduct.status}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No related products found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
