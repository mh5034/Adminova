"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/use-products";
import { ProductsTable } from "@/components/products/products-table";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductsToolbar } from "@/components/products/products-toolbar";

import Link from "next/link";
import { Boxes, LoaderCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsTableSkeleton } from "@/components/products/products-table-skeleton";

interface ProductsPageClientProps {
  canManage: boolean;
}

interface ProductQuery {
  page: number;
  search: string;
  category: string;
  status: string;
  sort: string;
  order: "asc" | "desc";
  hasActiveSort: boolean;
}

function getProductQuery(params: URLSearchParams): ProductQuery {
  const sortParam = params.get("sort");

  return {
    page: Math.max(Number(params.get("page")) || 1, 1),
    search: params.get("search") ?? "",
    category: params.get("category") ?? "all",
    status: params.get("status") ?? "all",
    sort: sortParam ?? "created_at",
    order: params.get("order") === "asc" ? "asc" : "desc",
    hasActiveSort: sortParam !== null,
  };
}

export function ProductsPageClient({ canManage }: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() =>
    getProductQuery(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    function syncFromUrl() {
      setQuery(getProductQuery(new URLSearchParams(window.location.search)));
    }

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const { page, search, category, status, sort, order, hasActiveSort } = query;

  const { data, isLoading, isFetching, isError } = useProducts({
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
      });
      return;
    }

    // Ascending → descending
    if (order === "asc") {
      updateParams({
        sort: column,
        order: "desc",
      });
      return;
    }

    // Descending → default
    updateParams({
      sort: "",
      order: "",
    });
  }

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(window.location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setQuery(getProductQuery(params));
    const queryString = params.toString();
    const url = `${window.location.pathname}${
      queryString ? `?${queryString}` : ""
    }${window.location.hash}`;
    window.history.replaceState(null, "", url);
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

  function handleClearFilters() {
    updateParams({
      search: "",
      category: "all",
      status: "all",
      page: "1",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Products</h1>
            <span
              className="inline-flex w-36 items-center gap-1.5 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {isFetching && (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Updating...
                </>
              )}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            Manage and monitor your product inventory.
          </p>
        </div>

        {canManage && (
          <Button
            nativeButton={false}
            render={
              <Link href="/products/new">
                <Plus />
                Add Product
              </Link>
            }
          />
        )}
      </div>

      <ProductsToolbar
        key={search}
        search={search}
        category={category}
        status={status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
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
          canManage={canManage}
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
