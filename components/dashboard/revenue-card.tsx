"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface RevenueData {
  totalRevenue: number;
}

export function RevenueCard() {
  const { data, isLoading } = useQuery<RevenueData>({
    queryKey: ["revenue"],
    queryFn: async () => {
      const response = await fetch("/api/orders/revenue");
      if (!response.ok) {
        throw new Error("Failed to fetch revenue data");
      }
      return response.json();
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="text-2xl font-bold">
            {formatCurrency(data?.totalRevenue || 0)}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Total penjualan dari semua produk
        </p>
      </CardContent>
    </Card>
  );
}
