"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface OrdersData {
  total: number;
  pending: number;
  processing: number;
  completed: number;
}

export function OrdersCard() {
  const { data, isLoading } = useQuery<OrdersData>({
    queryKey: ["orders-stats"],
    queryFn: async () => {
      const response = await fetch("/api/orders/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch orders data");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pesanan</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const orders = data || { total: 0, pending: 0, processing: 0, completed: 0 };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pesanan</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{orders.total}</div>
        <p className="text-xs text-muted-foreground">Total pesanan</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Menunggu</span>
            <span className="font-medium text-yellow-500">
              {orders.pending}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Diproses</span>
            <span className="font-medium text-blue-500">
              {orders.processing}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Selesai</span>
            <span className="font-medium text-green-500">
              {orders.completed}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
