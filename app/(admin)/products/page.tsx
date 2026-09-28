"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/use-products";
import { ProductsTable } from "@/components/products/products-table";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductsToolbar } from "@/components/products/products-toolbar";

import Link from "next/link";
import { Boxes, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsTableSkeleton } from "@/components/products/products-table-skeleton";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "all";
  const status = searchParams.get("status") ?? "all";

  const sortParam = searchParams.get("sort");
  const orderParam = searchParams.get("order");

  const sort = sortParam ?? "created_at";

  const order: "asc" | "desc" = orderParam === "asc" ? "asc" : "desc";

  const hasActiveSort = sortParam !== null;

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
    // No active sort or switching columns → ascending
    if (!hasActiveSort || sort !== column) {
      updateParams({
        sort: column,
        order: "asc",
        page: "1",
      });
      return;
    }

    // Ascending → descending
    if (order === "asc") {
      updateParams({
        sort: column,
        order: "desc",
        page: "1",
      });
      return;
    }

    // Descending → default
    updateParams({
      sort: "",
      order: "",
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

      {isLoading ? (
        <ProductsTableSkeleton />
      ) : isError ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="font-medium">Unable to load products</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : data && data.data.length > 0 ? (
        <ProductsTable
          products={data.data}
          page={page}
          sort={sort}
          order={order}
          hasActiveSort={hasActiveSort}
          onSortChange={handleSortChange}
        />
      ) : (
        <div className="rounded-lg border p-10 text-center">
          <Boxes className="mx-auto mb-3 size-8 text-muted-foreground" />

          <h3 className="font-medium">No products found</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      )}

      <ProductsPagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
