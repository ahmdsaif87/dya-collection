"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

// Helper function to generate slug from product name
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  variant: { id: string; name: string; stock: number }[];
  slug?: string;
}

interface ProductListProps {
  categoryFilter?: string;
}

function ProductCard({ product }: { product: Product }) {
  // Generate slug if not provided by the API
  const slug = product.slug || generateSlug(product.name);

  return (
    <Link href={`/products/${slug}`} key={slug}>
      <Card className="w-full h-full rounded-xl relative overflow-hidden shadow-md">
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
          <div className="flex border rounded-full items-center gap-2 p-2 bg-glass bg-white/10 backdrop-blur-md">
            <span className="text-sm font-semibold">{product.name}</span>
            <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
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
    <div className="w-full h-full rounded-xl relative overflow-hidden ">
      <Skeleton className="w-60 h-60" />
    </div>
  );
}

export function ProductList({ categoryFilter }: ProductListProps) {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", categoryFilter],
    queryFn: async () => {
      const response = await fetch(
        categoryFilter
          ? `/api/products?category=${encodeURIComponent(categoryFilter)}`
          : "/api/products"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Ensure each product has a slug
      return data.map((product: Product) => ({
        ...product,
        slug: product.slug || generateSlug(product.name),
      }));
    },
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
