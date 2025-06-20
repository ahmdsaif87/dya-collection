"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { columns, CategoryColumn } from "./columns";
import { CategoryForm } from "./category-form";

async function getCategories() {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const data = await response.json();
  return data.map((category: any) => ({
    id: category.id,
    name: category.name,
    productsCount: category._count.products,
    createdAt: new Date(category.createdAt).toLocaleDateString(),
  }));
}

export function CategoriesClient() {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryColumn | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      console.error("[DELETE_CATEGORY]", error);
      toast.error(error.message);
    },
  });

  const onDelete = async (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
    } catch (error) {
      // Error is already handled in mutation's onError
    } finally {
      setDeleteId(null);
    }
  };

  const onSubmit = async (data: { name: string }) => {
    try {
      if (selectedCategory) {
        const response = await fetch(`/api/categories/${selectedCategory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw response;
        }

        await queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Category updated successfully");
        setOpen(false);
      } else {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw response;
        }

        await queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Category created successfully");
        setOpen(false);
      }
    } catch (error: any) {
      if (error?.status === 409) {
        throw error;
      }
      console.error("[CATEGORY_ERROR]", error);
      toast.error("Something went wrong");
    }
  };

  const openEditDialog = (category: CategoryColumn) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? "Edit Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm initialData={selectedCategory} onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns}
        data={categories}
        onDelete={onDelete}
        openEditDialog={openEditDialog}
      />
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category and all its associated products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
