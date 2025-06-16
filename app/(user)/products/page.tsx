"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
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
      <Card className="h-full overflow-hidden group">
        <div className="aspect-square relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatPrice(product.price)}
          </p>
          {product.variant.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {product.variant.length} variants available
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </Card>
  );
}

export default function ProductsPage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </main>
  );
}
