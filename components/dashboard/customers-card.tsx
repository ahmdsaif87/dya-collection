"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface CustomersData {
  total: number;
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


  const customers = data || { total: 0, new: 0, percentageChange: 0 };

  return (
    <Card>  
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent >
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="text-2xl font-bold">{customers.total}</div>
        )}
        <p className="text-xs text-muted-foreground">
          Total pelanggan yang terdaftar
        </p>
      </CardContent>
    </Card>
  );
}
