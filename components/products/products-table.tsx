import type { Product } from "@/types/product"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({
  products,
}: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.name}
              </TableCell>

              <TableCell>
                {product.category}
              </TableCell>

              <TableCell>
                ${Number(product.price).toFixed(2)}
              </TableCell>

              <TableCell>
                {product.stock}
              </TableCell>

              <TableCell>
                <StatusBadge status={product.status} />
              </TableCell>

              <TableCell>
                {new Date(product.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: Product["status"]
}) {
  switch (status) {
    case "active":
      return <Badge>Active</Badge>

    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>

    case "draft":
      return <Badge variant="outline">Draft</Badge>
  }
}