"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import AnimatedSection from "./animated-section";
import { CldImage } from "next-cloudinary";

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
  sortBy?: string;
  className?: string;
  page?: number;
  onPageChange?: (totalPages: number) => void;
  excludeProduct?: string;
}

interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  total: number;
}

interface InfiniteProductsResponse {
  pages: ProductsResponse[];
  pageParams: number[];
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function ProductCard({ product }: { product: Product }) {
  const slug = product.slug || generateSlug(product.name);
  const isOutOfStock =
    !product.variant ||
    product.variant.length === 0 ||
    product.variant.every((v) => v.stock <= 0);

  return (
    <motion.div variants={item}>
      <Link href={`/products/${slug}`}>
        <Card
          className={`w-full h-full rounded-xl relative overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg ${
            isOutOfStock ? "opacity-50" : ""
          }`}
        >
          <CardHeader className="flex items-center justify-center p-4">
            <CldImage
              src={product.imageUrl}
              width={200}
              height={200}
              removeBackground={true}
              alt={product.name}
              className="object-contain hover:scale-115 transition-all duration-300"
            />
          </CardHeader>
          <CardContent className="absolute bottom-0 left-0 right-0 p-3 flex items-center">
            <div className="flex border rounded-full items-center gap-2 p-2 bg-glass bg-white/10 backdrop-blur-md">
              <span className="text-sm font-semibold">{product.name}</span>
              <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                {formatPrice(product.price)}
              </span>
            </div>
          </CardContent>
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/80 text-white px-6 py-3 rounded-full font-semibold text-lg backdrop-blur-sm">
                Habis
              </div>
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="w-full h-full rounded-xl relative overflow-hidden">
      <Skeleton className="w-100 h-70" />
    </div>
  );
}

const ITEMS_PER_PAGE = 12;

export function ProductList({
  categoryFilter,
  sortBy = "relevance",
  className,
  page = 1,
  onPageChange,
  excludeProduct,
}: ProductListProps) {
  const loadMoreRef = useRef(null);
  const isLoadMoreInView = useInView(loadMoreRef);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<
      ProductsResponse,
      Error,
      InfiniteProductsResponse,
      (string | undefined)[],
      string
    >({
      queryKey: [
        "products",
        categoryFilter,
        sortBy,
        String(page),
        excludeProduct,
      ],
      initialPageParam: String(page),
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          page: pageParam,
          limit: String(ITEMS_PER_PAGE),
          sort: sortBy,
        });

        if (categoryFilter) {
          // Convert category name to slug format if it's not already
          const categorySlug = categoryFilter
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          params.append("category", categorySlug);
        }

        if (excludeProduct) {
          params.append("exclude", excludeProduct);
        }

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // Calculate total pages and notify parent component
        if (onPageChange) {
          const totalPages = Math.ceil(data.total / ITEMS_PER_PAGE);
          onPageChange(totalPages);
        }

        return data as ProductsResponse;
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore
          ? String(Number(lastPage.products.length) + 1)
          : undefined,
    });

  useEffect(() => {
    if (isLoadMoreInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isLoadMoreInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <>
      <AnimatedSection
        delay={0.3}
        className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
      >
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatedSection>

      {/* Loading indicator and load more trigger */}
      <div ref={loadMoreRef} className="mt-8 text-center">
        {isFetchingNextPage && (
          <div
            className={`grid gap-4 ${
              className ||
              "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
