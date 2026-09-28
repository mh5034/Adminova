"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductsToolbarProps {
  search: string;
  category: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ProductsToolbar({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: ProductsToolbarProps) {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== search) {
        onSearchChange(searchValue);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <Input
        placeholder="Search products..."
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        className="md:max-w-sm"
      />

      <Select
        value={category}
        onValueChange={(value) => {
          if (value) onCategoryChange(value);
        }}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="Electronics">Electronics</SelectItem>
          <SelectItem value="Clothing">Clothing</SelectItem>
          <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
          <SelectItem value="Sports">Sports</SelectItem>
          <SelectItem value="Accessories">Accessories</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) => {
          if (value) onStatusChange(value);
        }}
      >
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
