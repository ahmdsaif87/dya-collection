"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ProductResponse } from "../types";

interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  categoryId: string;
  variants: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
  createdAt: string;
}

async function getProducts(): Promise<FormattedProduct[]> {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.map((product: ProductResponse) => ({
    id: String(product.id),
    name: String(product.name),
    description: String(product.description || ""),
    price: Number(product.price),
    imageUrl: String(product.imageUrl || ""),
    category: String(product.category?.name || ""),
    categoryId: String(product.category?.id || ""),
    variants:
      product.variant?.map((v) => ({
        id: String(v.id),
        name: String(v.name),
        stock: Number(v.stock),
      })) || [],
    createdAt: new Date(product.createdAt).toLocaleDateString(),
  }));
}

export function ProductsClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
  });

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      router.refresh();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const openEditDialog = (product: FormattedProduct) => {
    router.push(`/admin/products/${product.id}`);
  };

  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={products}
        onDelete={onDelete}
        openEditDialog={openEditDialog}
        key={products.length}
      />
    </div>
  );
}
