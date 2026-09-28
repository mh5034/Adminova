"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Product } from "@/types/product";

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

interface DeleteProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProductDialog({
  product,
  open,
  onOpenChange,
}: DeleteProductDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!product) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Failed to delete product");
      }

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product deleted successfully");

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete product", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete <strong>{product?.name}</strong>. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
