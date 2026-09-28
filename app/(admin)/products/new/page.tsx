import { ProductForm } from "@/components/products/product-form"

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Create Product
        </h1>

        <p className="text-sm text-muted-foreground">
          Add a new product to your inventory.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <ProductForm />
      </div>
    </div>
  )
}