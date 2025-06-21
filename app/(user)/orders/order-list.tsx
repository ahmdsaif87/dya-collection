"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Order, OrderItem, Product, Address } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface ExtendedOrderItem extends OrderItem {
  product: Product;
}

interface ExtendedOrder extends Order {
  items: ExtendedOrderItem[];
  address: Address;
}

const orderStatusMap = {
  ALL: {
    label: "Semua",
    value: "",
  },
  PENDING: {
    label: "Belum Bayar",
    value: "pending",
    variant: "secondary" as const,
  },
  PAID: {
    label: "Sedang Dikemas",
    value: "paid",
    variant: "default" as const,
  },
  SHIPPED: {
    label: "Dikirim",
    value: "shipped",
    variant: "default" as const,
  },
  COMPLETED: {
    label: "Selesai",
    value: "completed",
    variant: "default" as const,
  },
  CANCELLED: {
    label: "Dibatalkan",
    value: "cancelled",
    variant: "destructive" as const,
  },
};

async function getOrders(status?: string) {
  const params = new URLSearchParams();
  if (status) {
    params.set("status", status);
  }
  const response = await fetch(`/api/orders?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

export function OrderList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const { data: orders = [], isLoading } = useQuery<ExtendedOrder[]>({
    queryKey: ["orders", status],
    queryFn: () => getOrders(status || undefined),
  });

  const onStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`/orders?${params.toString()}`);
  };

  return (
    <div className="space-y-8 ">
      <Tabs defaultValue={status || ""} onValueChange={onStatusChange}>
        <TabsList className="w-full h-auto flex flex-wrap gap-2 bg-transparent">
          {Object.entries(orderStatusMap).map(([key, { label, value }]) => (
            <TabsTrigger
              key={key}
              value={value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="space-y-8">
        {isLoading
          ? Array.from({ length: 1 }).map((_, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 space-y-4 bg-muted animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>

                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))
          : orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-6 space-y-4 bg-card flex flex-col "
              >
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id.slice(-8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), "d MMMM yyyy, HH:mm", {
                        locale: id,
                      })}
                    </p>
                  </div>
                  <Badge variant={orderStatusMap[order.status].variant}>
                    {orderStatusMap[order.status].label}
                  </Badge>
                </div>

                {/* Item List */}
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

                {/* Address */}
                <div className="text-sm space-y-1 border-t pt-4">
                  <p className="font-medium">{order.address.name}</p>
                  <p className="text-muted-foreground">{order.address.phone}</p>
                  <p className="text-muted-foreground">
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.province} {order.address.postalCode}
                  </p>
                </div>

                {/* Button */}
                <div className="flex justify-end">
                  <Button asChild variant="outline">
                    <Link href={`/orders/${order.id}`}>Lihat Detail</Link>
                  </Button>
                </div>
              </div>
            ))}

        {orders.length === 0 && (
          <div className="text-center text-muted-foreground h-100 flex items-center justify-center flex-col">
            Tidak ada pesanan yang ditemukan
            <Link href={"/search"} className="underline">Belanja yukk 🥰</Link>
          </div>
        )}
      </div>
    </div>
  );
}
