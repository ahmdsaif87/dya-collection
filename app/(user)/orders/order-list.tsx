"use client";

import Link from "next/link";
import { Order, OrderItem, Product, Address } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ExtendedOrderItem extends OrderItem {
  product: Product;
}

interface ExtendedOrder extends Order {
  items: ExtendedOrderItem[];
  address: Address;
}

interface OrderListProps {
  orders: ExtendedOrder[];
}

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

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada pesanan</p>
        <Button asChild className="mt-4">
          <Link href="/">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-6 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Order #{order.id.slice(-8)}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(order.createdAt, "d MMMM yyyy, HH:mm", { locale: id })}
              </p>
            </div>
            <Badge variant={orderStatusMap[order.status].variant}>
              {orderStatusMap[order.status].label}
            </Badge>
          </div>

          <div className="space-y-2 pt-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="text-sm space-y-1 border-t pt-4">
            <p className="font-medium">{order.address.name}</p>
            <p className="text-muted-foreground">{order.address.phone}</p>
            <p className="text-muted-foreground">
              {order.address.street}, {order.address.city},{" "}
              {order.address.province} {order.address.postalCode}
            </p>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href={`/orders/${order.id}`}>Lihat Detail</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
