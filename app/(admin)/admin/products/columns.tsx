"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export interface ProductVariant {
  id: string;
  name: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  categoryId: string;
  variants: ProductVariant[];
  createdAt: string;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "variants",
    header: "Variants & Stock",
    cell: ({ row }) => {
      const variants = row.original.variants || [];
      if (variants.length === 0)
        return <div className="text-muted-foreground">No variants</div>;

      return (
        <div className="flex flex-col gap-1">
          {variants.slice(0, 3).map((variant) => (
            <Badge
              key={variant.id}
              variant="outline"
              className="justify-between"
            >
              <span>{variant.name}</span>
              <span className="ml-2 text-xs">
                {variant.stock > 0 ? `${variant.stock} units` : "Out of stock"}
              </span>
            </Badge>
          ))}
          {variants.length > 3 && (
            <Badge variant="outline">+{variants.length - 3} more</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        onDelete: (id: string) => void;
        openEditDialog: (product: Product) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta.openEditDialog(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.onDelete(row.original.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
