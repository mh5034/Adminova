"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/use-products";
import { ProductsTable } from "@/components/products/products-table";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductsToolbar } from "@/components/products/products-toolbar";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "all";
  const status = searchParams.get("status") ?? "all";

  const sort = searchParams.get("sort") ?? "created_at";

  const order: "asc" | "desc" =
    searchParams.get("order") === "asc" ? "asc" : "desc";

  const { data, isLoading, isError } = useProducts({
    page,
    limit: 10,
    search,
    category,
    status,
    sort,
    order,
  });

  function handleSortChange(column: string) {
    const newOrder = sort === column && order === "asc" ? "desc" : "asc";

    updateParams({
      sort: column,
      order: newOrder,
      page: "1",
    });
  }

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`/products?${params.toString()}`, {
      scroll: false,
    });
  }

  function handlePageChange(newPage: number) {
    updateParams({
      page: newPage.toString(),
    });
  }

  function handleSearchChange(value: string) {
    updateParams({
      search: value,
      page: "1",
    });
  }

  function handleCategoryChange(value: string) {
    updateParams({
      category: value,
      page: "1",
    });
  }

  function handleStatusChange(value: string) {
    updateParams({
      status: value,
      page: "1",
    });
  }

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Failed to load products.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>

          <p className="text-sm text-muted-foreground">
            Manage and monitor your product inventory.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={
            <Link href="/products/new">
              <Plus />
              Add Product
            </Link>
          }
        />
      </div>

      <ProductsToolbar
        search={search}
        category={category}
        status={status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
      />

      <ProductsTable
        products={data?.data ?? []}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
      />

      <ProductsPagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
