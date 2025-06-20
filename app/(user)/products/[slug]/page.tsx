"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCartStore, type Product, type ProductVariant } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ProductList } from "@/components/product-list";

function ProductSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-5 py-10">
      <div className="flex md:flex-row flex-col w-full max-w-4xl gap-x-8">
        {/* Product Image Skeleton */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex flex-col items-start gap-2">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-16 w-3/4" />
          </div>
          <Skeleton className="h-8 w-32 mt-4" />

          <Separator className="my-4" />

          {/* Variants Selection Skeleton */}
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Add to Cart Button Skeleton */}
          <Skeleton className="h-12 w-48 rounded-full mt-8" />
        </div>
      </div>

      {/* Related Products Section Skeleton */}
      <div className="w-full max-w-7xl mt-10">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="flex gap-4 overflow-x-auto pb-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <RelatedProductSkeleton key={index} />
          ))}
        </div>
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
  const response = await fetch(`/api/products/${encodeURIComponent(slug)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const data = await response.json();
  return data;
}

async function getRelatedProducts() {
  const response = await fetch("/api/products?limit=10");
  if (!response.ok) {
    throw new Error("Failed to fetch related products");
  }
  const data = await response.json();
  // Add slug to each product
  return data.map((product: Product) => ({
    ...product,
    slug: product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
  }));
}

export default function Page() {
  const params = useParams();
  const slug = params?.slug as string;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
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

  const handleVariantChange = (variantId: string) => {
    const variant = product?.variant.find((v) => v.id === variantId);
    setSelectedVariant(variant || null);
    setQuantity(1);
  };

  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setQuantity(1);
    } else if (selectedVariant && newQuantity > selectedVariant.stock) {
      setQuantity(selectedVariant.stock);
      toast.error("Quantity cannot exceed available stock");
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) {
      toast.error("Product not found");
      return;
    }

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

    addItem({
      productId: product.id,
      productVariantId: selectedVariant.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        categoryId: product.categoryId,
        category: product.category,
      },
      productVariant: selectedVariant,
    });

    toast.success(
      `${product.name} ${selectedVariant.name} di tambahkan ke keranjang!`
    );
  };

  if (productLoading) {
    return <ProductSkeleton />;
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
  const isOutOfStock =
    !product.variant ||
    product.variant.length === 0 ||
    product.variant.every((v) => v.stock <= 0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between  py-10">
      <div className="flex md:flex-row flex-col w-full max-w-4xl gap-x-8 px-5">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <div className="aspect-square overflow-hidden relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-foreground text-white px-6 py-3 rounded-full font-semibold text-lg">
                    Habis
                  </div>
                </div>
              )}
            </div>
          </Suspense>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex items-start justify-between">
            <h1 className="text-4xl md:text-7xl font-medium">
              <span className="block">{product.name}</span>
            </h1>
          </div>
          <Badge className="font-mono text-xl font-bold mt-4 rounded-full border-primary border-2 w-fit">
            {formatPrice(product.price)}
          </Badge>

          <Separator className="my-4" />
          {/* Variants Selection */}
          {product.variant && product.variant.length > 0 && (
            <div>
              <h3 className="text-sm font-medium">VARIANT</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variant.map((variant) => (
                  <Button
                    variant="outline"
                    key={variant.id}
                    onClick={() => handleVariantChange(variant.id)}
                    className={cn(
                      "rounded-full px-4 py-1 relative border-2",
                      selectedVariant?.id === variant.id &&
                        "border-2 border-primary",
                      variant.stock === 0 && "bg-muted "
                    )}
                    disabled={variant.stock === 0}
                  >
                    <span>{variant.name}</span>
                    {variant.stock === 0 && (
                      <span className="pointer-events-none absolute inset-0 w-full h-full flex items-center justify-center">
                        <div className="w-[90%] h-[2px] bg-muted-foreground/50 rotate-45 rounded-full" />
                      </span>
                    )}
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
          {!isOutOfStock && (
            <Button
              className="p-5 rounded-full w-fit mt-8 border-2 border-primary"
              size="lg"
              variant="default"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <Plus className="size-4 mr-2" />
              Tambahkan ke keranjang
            </Button>
          )}
          {isOutOfStock && (
            <div className="flex h-full pt-4 ">
              <p className="text-muted-foreground text-xl ">
                Produk ini Habis, silahkan pilih produk{" "}
                <Link href="/" className="text-primary underline">
                  lainnya
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Related Products */}
      <section className="w-full mt-24 mb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2 mb-8"
          >
            <h2 className="text-2xl font-medium text-center">
              Produk yang mungkin Anda sukai
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Rekomendasi produk serupa untuk Anda
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProductList
              categoryFilter={product.categoryId}
              className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              excludeProduct={product.id}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
