export type ProductStatus = "active" | "inactive" | "draft";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
