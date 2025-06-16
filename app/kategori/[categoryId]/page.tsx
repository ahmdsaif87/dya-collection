"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  variant: {
    id: string;
    name: string;
    stock: number;
  }[];
  category: {
    id: string;
    name: string;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedVariants, setSelectedVariants] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/categories/${params.categoryId}/products`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.categoryId]);

  const handleVariantSelect = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantId,
    }));
  };

  const addToCart = async (product: Product) => {
    const selectedVariantId = selectedVariants[product.id];
    if (!selectedVariantId) {
      toast.error("Please select a variant");
      return;
    }

    const selectedVariant = product.variant.find(
      (v) => v.id === selectedVariantId
    );
    if (!selectedVariant) {
      toast.error("Selected variant not found");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariantId,
          quantity: 1,
          productName: product.name,
          variantName: selectedVariant.name,
          price: product.price,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">No products found in this category</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        {products[0]?.category?.name || "Products"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  ${product.price.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Select Variant:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variant.map((variant) => (
                    <Badge
                      key={variant.id}
                      variant={
                        selectedVariants[product.id] === variant.id
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() =>
                        handleVariantSelect(product.id, variant.id)
                      }
                    >
                      {variant.name}
                      {variant.stock === 0 && " (Out of stock)"}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => addToCart(product)}
                disabled={
                  !selectedVariants[product.id] ||
                  product.variant.find(
                    (v) => v.id === selectedVariants[product.id]
                  )?.stock === 0
                }
              >
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
