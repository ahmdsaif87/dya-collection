"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";

interface Variant {
  id: string;
  name: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  variant: Variant[];
}

function ProductSkeleton() {
  return (
    <div className="flex w-full max-w-7xl gap-x-8 border p-7 bg-card">
      <div className="w-1/2">
        <Skeleton className="aspect-square w-full" />
      </div>
      <div className="w-1/2 flex flex-col">
        <Skeleton className="h-16 w-3/4 mb-2" />
        <Skeleton className="h-16 w-1/2" />
        <Skeleton className="h-8 w-32 mt-4" />
        <Separator className="my-4" />
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-24 w-full mt-4" />
        <Skeleton className="h-16 w-full mt-8" />
      </div>
    </div>
  );
}

function RelatedProductSkeleton() {
  return (
    <Card className="w-60 gap-2 relative inline-block">
      <CardHeader>
        <Skeleton className="w-[200px] h-[200px] rounded-lg" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

async function getProduct(slug: string) {
  const response = await fetch(`/api/products/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

async function getRelatedProducts() {
  const response = await fetch("/api/products?limit=10");
  if (!response.ok) {
    throw new Error("Failed to fetch related products");
  }
  return response.json();
}

export default function Page() {
  const { slug } = useParams();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => getProduct(String(slug)),
  });

  const { data: relatedProducts = [], isLoading: relatedLoading } = useQuery<
    Product[]
  >({
    queryKey: ["relatedProducts"],
    queryFn: getRelatedProducts,
  });

  const handleAddToCart = async () => {
    try {
      if (!selectedVariant) {
        toast.error("Please select a variant");
        return;
      }

      if (quantity <= 0) {
        toast.error("Please select a valid quantity");
        return;
      }

      if (quantity > selectedVariant.stock) {
        toast.error("Quantity exceeds available stock");
        return;
      }

      setIsAddingToCart(true);
      await addItem({
        productId: selectedVariant.id,
        quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          variant: product.variant,
        },
      });
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add item to cart"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (productLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-4">
        <ProductSkeleton />
        <div className="w-full max-w-7xl mt-10">
          <h2 className="text-2xl font-medium justify-start">
            Produk yang mungkin anda sukai
          </h2>
          <div className="flex gap-4 mt-4 overflow-x-auto pb-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <RelatedProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium">Product not found</h2>
          <p className="text-muted-foreground mt-2">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-4">
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="flex w-full max-w-7xl gap-x-8 border p-7 bg-card">
        {/* Product Image */}
        <div className="w-1/2">
          <div className="aspect-square overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-start justify-between">
            <h1 className="text-7xl font-medium">
              <span className="block">{product.name.split(" ")[0]}</span>
              <span className="block">
                {product.name.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <Badge variant="secondary" className="text-sm">
              {product.category.name}
            </Badge>
          </div>
          <Badge className="font-mono text-xl font-bold mt-4 rounded-full border-primary border-2 w-fit">
            Rp. {product.price.toLocaleString("id-ID")}
          </Badge>

          <Separator className="my-4" />
          {/* Variants Selection */}
          {product.variant && product.variant.length > 0 && (
            <div>
              <h3 className="text-sm font-medium">VARIAN</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variant.map((variant) => (
                  <Button
                    variant="outline"
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "rounded-full px-4 py-1",
                      selectedVariant?.id === variant.id &&
                        "border-3 border-primary"
                    )}
                    disabled={variant.stock === 0}
                  >
                    <span>{variant.name}</span>
                    <Badge
                      variant={variant.stock > 0 ? "secondary" : "destructive"}
                      className="ml-2"
                    >
                      {variant.stock > 0
                        ? `${variant.stock} left`
                        : "Out of stock"}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}
          {product.description && (
            <p className="text-md text-muted-foreground mt-4">
              {product.description}
            </p>
          )}

          {/* Add to Cart Button */}
          <Button
            className="p-10 rounded-full w-full mt-8 text-lg"
            size="lg"
            variant="outline"
            onClick={handleAddToCart}
            disabled={
              isAddingToCart || !selectedVariant || selectedVariant.stock === 0
            }
          >
            {isAddingToCart ? (
              "Adding to Cart..."
            ) : !selectedVariant ? (
              "Select a Variant"
            ) : selectedVariant.stock === 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="size-8 mr-2" />
                Add To Cart
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="w-full max-w-7xl mt-10">
        <h2 className="text-2xl font-medium justify-start">
          Produk yang mungkin anda sukai
        </h2>
        <div className="flex gap-4 mt-4 overflow-x-auto pb-10">
          {relatedLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <RelatedProductSkeleton key={index} />
              ))
            : relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 6)
                .map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id}>
                    <Card className="w-60 gap-2 relative inline-block">
                      <CardHeader>
                        <Image
                          src={product.imageUrl}
                          width={200}
                          height={200}
                          alt={product.name}
                          className="transition-transform duration-300 hover:scale-105 rounded-lg"
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2">
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {product.description}
                        </CardDescription>
                        <div className="flex justify-between items-center">
                          <CardAction>
                            Rp.{product.price.toLocaleString("id-ID")}
                          </CardAction>
                          {product.variant.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {product.variant.length} variants
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
        </div>
      </div>
    </div>
  );
}
