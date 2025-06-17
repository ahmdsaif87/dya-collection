"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "../components/product-form";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
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

interface Category {
  id: string;
  name: string;
}

export default function EditProductPage() {
  const params = useParams();
  const productId = params?.productId as string;
  const [product, setProduct] = React.useState<Product | null>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch("/api/categories"),
        ]);

        if (!productRes.ok) {
          throw new Error("Failed to fetch product");
        }
        if (!categoriesRes.ok) {
          throw new Error("Failed to fetch categories");
        }

        const [productData, categoriesData] = await Promise.all([
          productRes.json(),
          categoriesRes.json(),
        ]);

        setProduct(productData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load data"
        );
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg font-medium">Loading...</div>
            <p className="text-sm text-muted-foreground">
              Please wait while we load the product data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg font-medium text-destructive">
              {error || "Product not found"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Please try again or contact support if the problem persists
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Make changes to your product here
        </p>
      </div>
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
