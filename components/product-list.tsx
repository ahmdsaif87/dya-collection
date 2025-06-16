"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  variant: { id: string; name: string }[];
}

async function getProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="gap-2 relative inline-block w-full">
        <CardHeader className="relative flex justify-center items-center">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={200}
            height={200}
            className="transition-transform duration-300 hover:scale-105 rounded-lg"
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardTitle>{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
            <p className="text-sm text-muted-foreground">
              {formatPrice(product.price)}
            </p>
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <Card className="w-full gap-2">
      <CardHeader className="p-0">
        <Skeleton className="aspect-square rounded-t-lg" />
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function ProductList() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
