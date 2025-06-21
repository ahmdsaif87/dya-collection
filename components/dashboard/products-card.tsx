"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2 } from "lucide-react";

interface ProductsData {
  total: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
}

export function ProductsCard() {
  const { data, isLoading } = useQuery<ProductsData>({
    queryKey: ["products-stats"],
    queryFn: async () => {
      const response = await fetch("/api/products/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch products data");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produk</CardTitle>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const products = data || { total: 0, inStock: 0, outOfStock: 0, lowStock: 0 };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Produk</CardTitle>
        <Package2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{products.total}</div>
        <p className="text-xs text-muted-foreground">Total produk</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tersedia</span>
            <span className="font-medium text-green-500">{products.inStock}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stok Menipis</span>
            <span className="font-medium text-yellow-500">{products.lowStock}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Habis</span>
            <span className="font-medium text-red-500">{products.outOfStock}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 