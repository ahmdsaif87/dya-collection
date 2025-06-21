"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface RevenueData {
  today: number;
  thisMonth: number;
  thisYear: number;
  percentageChange: number;
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const revenue = data || {
    today: 0,
    thisMonth: 0,
    thisYear: 0,
    percentageChange: 0,
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(revenue.thisMonth)}
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-muted-foreground">
            +{revenue.percentageChange}% dari bulan lalu
          </p>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Hari ini</span>
            <span className="font-medium">{formatCurrency(revenue.today)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tahun ini</span>
            <span className="font-medium">
              {formatCurrency(revenue.thisYear)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
