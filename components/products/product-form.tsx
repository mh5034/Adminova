"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { productSchema, type ProductInput } from "@/lib/validation/product";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Product } from "@/types/product";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const isEditing = Boolean(product);
  const draftKey = product
    ? `adminova-product-draft-${product.id}`
    : "adminova-product-draft-new";

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      category: product?.category ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      status: product?.status ?? "draft",
      image_url: product?.image_url ?? null,
      inactive_reason: product?.inactive_reason ?? null,
    },
  });
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);

    if (!savedDraft) return;

    try {
      const parsedDraft = JSON.parse(savedDraft) as ProductInput;
      reset(parsedDraft);
      toast.info("Draft restored");
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey, reset]);
  useEffect(() => {
    const subscription = watch((values) => {
      const timeout = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify(values));
      }, 800);

      return () => clearTimeout(timeout);
    });

    return () => subscription.unsubscribe();
  }, [watch, draftKey]);

  const handleNext = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isValid = await trigger(["name", "category", "status"]);

    if (isValid) {
      setStep(2);
    }
  };
  const category = watch("category");

  const status = watch("status");
  useEffect(() => {
    if (status !== "inactive") {
      setValue("inactive_reason", null);
    }
  }, [status, setValue]);
  async function onSubmit(values: ProductInput) {
    try {
      const response = await fetch(
        isEditing ? `/api/products/${product!.id}` : "/api/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(
          result.error ||
            (isEditing
              ? "Failed to update product"
              : "Failed to create product"),
        );
      }
      localStorage.removeItem(draftKey);

      toast.success(
        isEditing
          ? "Product updated successfully"
          : "Product added successfully",
      );

      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error(
        isEditing ? "Update product error:" : "Create product error:",
        error,
      );

      toast.error(
        isEditing ? "Failed to update product" : "Failed to add product",
        {
          description:
            error instanceof Error ? error.message : "Please try again.",
        },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
              step >= 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>

          <div
            className={`h-px flex-1 ${step >= 2 ? "bg-primary" : "bg-border"}`}
          />

          <div
            className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
              step >= 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Changes are automatically saved as a local draft.
        </p>

        <div className="mt-3 flex justify-between text-sm">
          <span className="font-medium">Basic information</span>
          <span className="font-medium">Pricing & inventory</span>
        </div>
      </div>
      {step === 1 && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="name">Product name</Label>

            <Input
              id="name"
              placeholder="Wireless Headphones"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              placeholder="Enter a product description..."
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>

            <Select
              value={category}
              onValueChange={(value) => {
                if (value) {
                  setValue("category", value, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>

                <SelectItem value="Clothing">Clothing</SelectItem>

                <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>

                <SelectItem value="Sports">Sports</SelectItem>

                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>

            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>

            <Select
              value={status}
              onValueChange={(value) => {
                if (
                  value === "active" ||
                  value === "inactive" ||
                  value === "draft"
                ) {
                  setValue("status", value, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>
          {status === "inactive" && (
            <div className="grid gap-2 rounded-md border bg-muted/50 p-4">
              <Label htmlFor="inactive_reason">Inactive reason</Label>

              <Textarea
                id="inactive_reason"
                placeholder="Why is this product inactive?"
                {...register("inactive_reason", {
                  setValueAs: (value) => (value === "" ? null : value),
                })}
              />

              <p className="text-xs text-muted-foreground">
                This field only appears when the product is inactive.
              </p>

              {errors.inactive_reason && (
                <p className="text-sm text-destructive">
                  {errors.inactive_reason.message}
                </p>
              )}
            </div>
          )}
        </>
      )}
      {step === 2 && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>

              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register("price")}
              />

              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>

              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                {...register("stock")}
              />

              {errors.stock && (
                <p className="text-sm text-destructive">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image_url">Image URL</Label>

            <Input
              id="image_url"
              placeholder="https://example.com/product.jpg"
              {...register("image_url", {
                setValueAs: (value) => (value === "" ? null : value),
              })}
            />

            {errors.image_url && (
              <p className="text-sm text-destructive">
                {errors.image_url.message}
              </p>
            )}
          </div>
        </>
      )}
      <div className="flex items-center justify-between pt-4">
        <div>
          {step === 2 && (
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {step === 1 ? (
            <Button key="continue" type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button key="submit" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create product"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
