import type { Product } from "@/types/product";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import Link from "next/link";

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
import { useState } from "react";
import { DeleteProductDialog } from "./delete-product-dialog";

interface ProductsTableProps {
  products: Product[];
  sort: string;
  order: "asc" | "desc";
  hasActiveSort: boolean;
  onSortChange: (column: string) => void;
}
export function ProductsTable({
  products,
  sort,
  order,
  hasActiveSort,
  onSortChange,
}: ProductsTableProps) {
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
            <TableHead className="w-12.5" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
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
