"use client";

import Image from "next/image";
import { Order, OrderItem, Product, Address } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderActions } from "./order-actions";
import { MapPin, Package } from "lucide-react";

interface ExtendedOrderItem extends OrderItem {
  product: Product;
}

interface ExtendedOrder extends Order {
  items: ExtendedOrderItem[];
  address: Address;
}

interface OrderDetailProps {
  order: ExtendedOrder;
}

const orderStatusMap = {
  PENDING: {
    label: "Menunggu Pembayaran",
    description: "Mohon segera melakukan pembayaran.",
    variant: "secondary" as const,
  },
  PAID: {
    label: "Sudah Dibayar",
    description: "Pesanan anda sedang dikemas.",
    variant: "default" as const,
  },
  SHIPPED: {
    label: "Dalam Pengiriman",
    description: "Pesanan sedang dalam pengiriman.",
    variant: "default" as const,
  },
  COMPLETED: {
    label: "Selesai",
    description: "Pesanan telah diterima, terima kasih.",
    variant: "default" as const,
  },
  CANCELLED: {
    label: "Dibatalkan",
    description: "Pesanan telah dibatalkan.",
    variant: "destructive" as const,
  },
};

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            ID Pesanan:{" "}
            <span className="font-medium">#{order.id.slice(-8)}</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Badge
            variant={orderStatusMap[order.status].variant}
            className="h-8 px-4 text-sm w-fit flex items-center"
          >
            {orderStatusMap[order.status].label}
          </Badge>

          <p className="text-muted-foreground text-sm">
            {orderStatusMap[order.status].description}
          </p>

          <p className="text-sm text-muted-foreground">
            Dibuat pada{" "}
            <span className="font-medium">
              {format(order.createdAt, "d MMMM yyyy, HH:mm", { locale: id })}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4 mr-2" /> Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative aspect-square h-20 w-20 overflow-hidden rounded-lg border">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 mr-2" /> Alamat Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">{order.address.name}</p>
            <p className="text-muted-foreground">{order.address.phone}</p>
            <p className="text-muted-foreground">
              {order.address.street}
              <br />
              {order.address.city}, {order.address.province}{" "}
              {order.address.postalCode}
              <br />
              {order.address.country}
            </p>
          </CardContent>
        </Card>
      </div>

      <OrderActions order={order} />
    </div>
  );
}
