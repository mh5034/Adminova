"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/use-products";
import { ProductsTable } from "@/components/products/products-table";
import { ProductsPagination } from "@/components/products/products-pagination";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const { data, isLoading, isError } = useProducts({
    page,
    limit: 10,
  });

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", newPage.toString());

    router.push(`/products?${params.toString()}`);
  }

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Failed to load products.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>

        <p className="text-sm text-muted-foreground">
          Manage and monitor your product inventory.
        </p>
      </div>

      <ProductsTable products={data?.data ?? []} />

      <ProductsPagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
