import type { Product, ProductsResponse } from "@/types/product";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { DeleteProductDialog } from "./delete-product-dialog";

interface ProductsTableProps {
  products: Product[];
  sort: string;
  page: number;
  order: "asc" | "desc";
  hasActiveSort: boolean;
  canManage: boolean;
  onSortChange: (column: string) => void;
}
export function ProductsTable({
  products,
  sort,
  page,
  order,
  hasActiveSort,
  canManage,
  onSortChange,
}: ProductsTableProps) {
  const queryClient = useQueryClient();
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  function SortIcon({ column }: { column: string }) {
    if (!hasActiveSort || sort !== column) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }

    return order === "asc" ? (
      <ArrowUp className="ml-2 size-4" />
    ) : (
      <ArrowDown className="ml-2 size-4" />
    );
  }

  useEffect(() => {
    setSelectedIds([]);
  }, [page]);

  async function handleBulkStatus(status: "active" | "inactive" | "draft") {
    setIsBulkLoading(true);

    // Stop any products refetch from overwriting our optimistic update
    await queryClient.cancelQueries({
      queryKey: ["products"],
    });

    // Save all current product query caches for rollback
    const previousQueries = queryClient.getQueriesData<ProductsResponse>({
      queryKey: ["products"],
    });

    // update every cached products page
    queryClient.setQueriesData<ProductsResponse>(
      { queryKey: ["products"] },
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((product) =>
            selectedIds.includes(product.id)
              ? {
                  ...product,
                  status,
                }
              : product,
          ),
        };
      },
    );

    try {
      const response = await fetch("/api/products/bulk", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedIds,
          status,
        }),
      });

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Failed to update products");
      }

      setSelectedIds([]);

      toast.success("Products updated successfully");
    } catch (error) {
      // Roll back to the exact cache state from before the update
      previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error("Failed to update products", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      // Reconcile optimistic data with the real server state
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setIsBulkLoading(false);
    }
  }
  async function handleBulkDelete() {
    try {
      setIsBulkLoading(true);

      const response = await fetch("/api/products/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedIds,
        }),
      });

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Failed to delete products");
      }

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success(
        `${selectedIds.length} ${
          selectedIds.length === 1 ? "product" : "products"
        } deleted successfully`,
      );

      setSelectedIds([]);
      setBulkDeleteOpen(false);
    } catch (error) {
      console.error("Bulk delete error:", error);

      toast.error("Failed to delete products", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsBulkLoading(false);
    }
  }
  return (
    <div className="overflow-hidden rounded-lg border">
      {canManage && selectedIds.length > 0 && (
        <div className="flex items-center justify-between border-b bg-muted/40 p-3">
          <p className="text-sm font-medium">{selectedIds.length} selected</p>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" disabled={isBulkLoading}>
                    Change status
                  </Button>
                }
              />

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkStatus("active")}>
                  Active
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleBulkStatus("inactive")}>
                  Inactive
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleBulkStatus("draft")}>
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="destructive"
              size="sm"
              disabled={isBulkLoading}
              onClick={() => setBulkDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {canManage && (
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    products.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onCheckedChange={(checked) => {
                    setSelectedIds(
                      checked ? products.map((product) => product.id) : [],
                    );
                  }}
                  aria-label="Select all products"
                />
              </TableHead>
            )}
            <TableHead>
              <Button variant="ghost" onClick={() => onSortChange("name")}>
                Product
                <SortIcon column="name" />
              </Button>
            </TableHead>

            <TableHead>Category</TableHead>

            <TableHead>
              <Button variant="ghost" onClick={() => onSortChange("price")}>
                Price
                <SortIcon column="price" />
              </Button>
            </TableHead>

            <TableHead>
              <Button variant="ghost" onClick={() => onSortChange("stock")}>
                Stock
                <SortIcon column="stock" />
              </Button>
            </TableHead>

            <TableHead>Status</TableHead>

            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSortChange("created_at")}
              >
                Created
                <SortIcon column="created_at" />
              </Button>
            </TableHead>
            <TableHead className="w-12.5" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              {canManage && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={(checked) => {
                      setSelectedIds((current) =>
                        checked
                          ? [...current, product.id]
                          : current.filter((id) => id !== product.id),
                      );
                    }}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">
                <Link
                  href={`/products/${product.id}`}
                  className="font-medium hover:underline"
                >
                  {product.name}
                </Link>
              </TableCell>

              <TableCell>{product.category}</TableCell>

              <TableCell>${Number(product.price).toFixed(2)}</TableCell>

              <TableCell>{product.stock}</TableCell>

              <TableCell>
                <StatusBadge status={product.status} />
              </TableCell>

              <TableCell>
                {new Date(product.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${product.name}`}
                      >
                        <MoreHorizontal />
                      </Button>
                    }
                  />

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      render={
                        <Link href={`/products/${product.id}`}>
                          <Eye />
                          View details
                        </Link>
                      }
                    />

                    {canManage && (
                      <>
                        <DropdownMenuItem
                          render={
                            <Link href={`/products/${product.id}/edit`}>
                              <Pencil />
                              Edit
                            </Link>
                          }
                        />

                        <DropdownMenuItem
                          onClick={() => setProductToDelete(product)}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteProductDialog
        product={productToDelete}
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
          }
        }}
      />
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected products?</AlertDialogTitle>

            <AlertDialogDescription>
              You are about to permanently delete {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "product" : "products"}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkLoading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isBulkLoading}
              onClick={handleBulkDelete}
            >
              {isBulkLoading ? "Deleting..." : `Delete ${selectedIds.length}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  switch (status) {
    case "active":
      return <Badge>Active</Badge>;

    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;

    case "draft":
      return <Badge variant="outline">Draft</Badge>;
  }
}
