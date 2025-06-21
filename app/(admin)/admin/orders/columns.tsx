"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  CheckCircle2,
  DollarSign,
  Loader,
  Truck,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const orderStatusMap = {
  PENDING: {
    label: "Menunggu Pembayaran",
    variant: "secondary" as const,
    icon: Loader,
    className: " text-muted-foreground",
  },
  PAID: {
    label: "Sudah Dibayar",
    variant: "default" as const,
    icon: DollarSign,
    className: " text-green-500",
  },
  SHIPPED: {
    label: "Dalam Pengiriman",
    variant: "default" as const,
    icon: Truck,
    className: " text-yellow-500",
  },
  COMPLETED: {
    label: "Selesai",
    variant: "default" as const,
    icon: CheckCircle2,
    className: "text-green-500",
  },
  CANCELLED: {
    label: "Dibatalkan",
    variant: "destructive" as const,
    icon: X,
    className: "text-destructive",
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
      const statusConfig = orderStatusMap[status];
      const Icon = statusConfig.icon;

      return (
        <Select
          defaultValue={status}
          onValueChange={(value) =>
            meta.updateStatus(row.getValue("id"), value as OrderStatus)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", statusConfig.className)} />
                <span>{statusConfig.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(orderStatusMap).map(([value, config]) => {
              const StatusIcon = config.icon;
              return (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={cn("h-4 w-4", config.className)} />
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              );
            })}
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
