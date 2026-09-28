export type ProductStatus = "active" | "inactive" | "draft"

export interface Product {
  id: string
  name: string
  description: string | null
  category: string
  price: number
  stock: number
  status: ProductStatus
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface ProductsResponse {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}