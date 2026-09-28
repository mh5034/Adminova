"use client"

import { useQuery } from "@tanstack/react-query"
import type { ProductsResponse } from "@/types/product"

interface UseProductsParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  sort?: string
  order?: "asc" | "desc"
}

export function useProducts({
  page = 1,
  limit = 10,
  search = "",
  category = "all",
  status = "all",
  sort = "created_at",
  order = "desc",
}: UseProductsParams) {
  return useQuery<ProductsResponse>({
    queryKey: [
      "products",
      page,
      limit,
      search,
      category,
      status,
      sort,
      order,
    ],

    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order,
      })

      if (search) {
        params.set("search", search)
      }

      if (category !== "all") {
        params.set("category", category)
      }

      if (status !== "all") {
        params.set("status", status)
      }

      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      return response.json()
    },

    placeholderData: (previousData) => previousData,
  })
}