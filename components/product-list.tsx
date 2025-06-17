"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <Link href={`/products/${product.id}`} key={product.id}>
      <Card className="w-full  h-full rounded-xl relative overflow-hidden shadow-md">
        <CardHeader className="flex items-center justify-center p-4">
          <Image
            src={product.imageUrl}
            width={200}
            height={200}
            alt={product.name}
            className="transition-transform duration-300 hover:scale-105 object-contain"
          />
        </CardHeader>
        <CardContent className="absolute bottom-0 left-0 right-0 p-3 flex items-center ">
          <div className="flex border rounded-full  items-center  gap-2 p-2 bg-glass bg-white/10 backdrop-blur-md">
            <span className="text-sm font-semibold">{product.name}</span>
            <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full">
              {formatPrice(product.price)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <Card className="w-full  h-full rounded-xl relative overflow-hidden shadow-md">
      <CardHeader className="flex items-center justify-center p-4">
        <Skeleton className="w-60 h-60" />
      </CardHeader>
      <CardContent className="absolute bottom-0 left-0 right-0 p-3 flex items-center ">
        <div className="flex border rounded-full  items-center  gap-2 p-2 bg-glass bg-white/10 backdrop-blur-md">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
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
