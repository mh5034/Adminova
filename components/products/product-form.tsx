"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  productSchema,
  type ProductInput,
} from "@/lib/validation/product"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ProductForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      status: "draft",
      image_url: null,
    },
  })

  const category = watch("category")
  const status = watch("status")

  async function onSubmit(values: ProductInput) {
    setServerError(null)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      router.push("/products")
      router.refresh()
    } catch {
      setServerError(
        "Something went wrong while creating the product."
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Product name</Label>

        <Input
          id="name"
          placeholder="Wireless Headphones"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
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
              })
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="Electronics">
              Electronics
            </SelectItem>

            <SelectItem value="Clothing">
              Clothing
            </SelectItem>

            <SelectItem value="Home & Kitchen">
              Home & Kitchen
            </SelectItem>

            <SelectItem value="Sports">
              Sports
            </SelectItem>

            <SelectItem value="Accessories">
              Accessories
            </SelectItem>
          </SelectContent>
        </Select>

        {errors.category && (
          <p className="text-sm text-destructive">
            {errors.category.message}
          </p>
        )}
      </div>

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
              })
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

      <div className="grid gap-2">
        <Label htmlFor="image_url">Image URL</Label>

        <Input
          id="image_url"
          placeholder="https://example.com/product.jpg"
          {...register("image_url", {
            setValueAs: (value) =>
              value === "" ? null : value,
          })}
        />

        {errors.image_url && (
          <p className="text-sm text-destructive">
            {errors.image_url.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create product"}
        </Button>
      </div>
    </form>
  )
}