"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CustomersData {
  total: number;
  new: number;
  percentageChange: number;
}

export function CustomersCard() {
  const { data, isLoading } = useQuery<CustomersData>({
    queryKey: ["customers-stats"],
    queryFn: async () => {
      const response = await fetch("/api/customers/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch customers data");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const customers = data || { total: 0, new: 0, percentageChange: 0 };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{customers.total}</div>
        <p className="text-xs text-muted-foreground">Total pelanggan</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pelanggan Baru</span>
            <span className="font-medium text-green-500">+{customers.new}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pertumbuhan</span>
            <span className="font-medium text-green-500">
              +{customers.percentageChange}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
