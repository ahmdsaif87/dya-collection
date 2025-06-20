"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";

const orderStatusMap = {
  PENDING: {
    label: "Menunggu Pembayaran",
    variant: "secondary" as const,
  },
  PAID: {
    label: "Sudah Dibayar",
    variant: "default" as const,
  },
  SHIPPED: {
    label: "Dalam Pengiriman",
    variant: "default" as const,
  },
  COMPLETED: {
    label: "Selesai",
    variant: "default" as const,
  },
  CANCELLED: {
    label: "Dibatalkan",
    variant: "destructive" as const,
  },
};

export type OrderColumn = {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  addressId: string;
  createdAt: Date;
  updatedAt: Date;
  address: {
    name: string;
    phone: string;
  };
  items: {
    id: string;
    quantity: number;
    product: {
      name: string;
    };
  }[];
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <div>#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    accessorFn: (row) => row.address.name,
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <div>
          <div className="font-medium">{address.name}</div>
          <div className="text-sm text-muted-foreground">{address.phone}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as {
        quantity: number;
        product: { name: string };
      }[];
      return (
        <div className="space-y-1">
          {items.map((item, index) => (
            <div key={index} className="text-sm">
              {item.quantity}x {item.product.name}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatPrice(row.getValue("total")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row, table }) => {
      const status = row.getValue("status") as OrderStatus;
      const meta = table.options.meta as {
        updateStatus: (id: string, status: OrderStatus) => void;
      };

      return (
        <Select
          defaultValue={status}
          onValueChange={(value) =>
            meta.updateStatus(row.getValue("id"), value as OrderStatus)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              <Badge variant={orderStatusMap[status].variant}>
                {orderStatusMap[status].label}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(orderStatusMap).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>
                <Badge
                  variant={
                    orderStatusMap[value as keyof typeof orderStatusMap].variant
                  }
                >
                  {label}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return format(row.getValue("createdAt"), "d MMM yyyy, HH:mm", {
        locale: id,
      });
    },
  },
];
 