"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

interface OrdersData {
  total: number;
  pending: number;
  paid: number;
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

  const orders = data || { total: 0, pending: 0, paid: 0, completed: 0 };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Orderan</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-10 w-full" /> : orders.total}
        </div>
        <Separator />
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              <>
                <span className="text-muted-foreground">Menunggu</span>
                <span className="font-medium text-yellow-500">
                  {orders.pending}
                </span>
              </>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dibayar</span>
              <span className="font-medium text-blue-500">
                {orders.paid}
              </span>
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Selesai</span>
              <span className="font-medium text-green-500">
                {orders.completed}
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Total orderan yang terdaftar
        </p>
      </CardContent>
    </Card>
  );
}
