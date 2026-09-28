import type { Product } from "@/types/product";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductsTableProps {
  products: Product[];
  sort: string;
  order: "asc" | "desc";
  onSortChange: (column: string) => void;
}
export function ProductsTable({
  products,
  sort,
  order,
  onSortChange,
}: ProductsTableProps) {
  function SortIcon({ column }: { column: string }) {
    if (sort !== column) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }

    return order === "asc" ? (
      <ArrowUp className="ml-2 size-4" />
    ) : (
      <ArrowDown className="ml-2 size-4" />
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
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
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>

              <TableCell>{product.category}</TableCell>

              <TableCell>${Number(product.price).toFixed(2)}</TableCell>

              <TableCell>{product.stock}</TableCell>

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
