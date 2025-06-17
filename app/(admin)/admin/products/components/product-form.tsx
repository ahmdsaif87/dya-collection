"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import { Card } from "@/components/ui/card";

interface ProductVariant {
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
  variant: ProductVariant[];
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(
      /^[a-zA-Z0-9\s\-']+$/,
      "Name can only contain letters, numbers, spaces, hyphens, and apostrophes"
    )
    .transform((str) => str.trim()),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  categoryId: z.string().min(1, "Category is required"),
});

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: Product;
  categories?: Category[];
}

export function ProductForm({
  initialData,
  categories = [],
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [variants, setVariants] = React.useState<ProductVariant[]>(
    initialData?.variant || []
  );
  const [newVariant, setNewVariant] = React.useState("");
  const [newVariantStock, setNewVariantStock] = React.useState<number>(0);
  const [newCategory, setNewCategory] = React.useState("");
  const [isCreatingCategory, setIsCreatingCategory] = React.useState(false);
  const [localCategories, setLocalCategories] = React.useState(categories);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      imageUrl: initialData?.imageUrl || "",
      categoryId: initialData?.categoryId || "",
    },
  });

  const addVariant = () => {
    if (
      newVariant.trim() &&
      !variants.find((v) => v.name === newVariant.trim())
    ) {
      setVariants([
        ...variants,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newVariant.trim(),
          stock: newVariantStock,
        },
      ]);
      setNewVariant("");
      setNewVariantStock(0);
    }
  };

  const removeVariant = (variantId: string) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const updateVariantStock = (variantId: string, stock: number) => {
    setVariants(
      variants.map((v) => (v.id === variantId ? { ...v, stock } : v))
    );
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      setIsCreatingCategory(true);
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const category = await response.json();
      setLocalCategories([...localCategories, category]);
      form.setValue("categoryId", category.id);
      setNewCategory("");
      setIsNewCategoryOpen(false);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (variants.length === 0) {
        toast.error("At least one variant is required");
        return;
      }

      setLoading(true);
      const response = await fetch(
        initialData ? `/api/products/${initialData.id}` : "/api/products",
        {
          method: initialData ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            price: parseFloat(values.price),
            variant: variants,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      router.push("/admin/products");
      toast.success(
        initialData
          ? "Product updated successfully"
          : "Product created successfully"
      );
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto"
      >
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Product Information</h3>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : initialData ? "Update" : "Create"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Product name"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Product description"
                      disabled={loading}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter price"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Image URL"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="flex gap-2">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                        <Popover
                          open={isNewCategoryOpen}
                          onOpenChange={setIsNewCategoryOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal"
                              disabled={loading}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add new category
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-4 w-80">
                            <div className="space-y-4">
                              <h4 className="font-medium">
                                Create New Category
                              </h4>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Category name"
                                  value={newCategory}
                                  onChange={(e) =>
                                    setNewCategory(e.target.value)
                                  }
                                  disabled={isCreatingCategory}
                                />
                                <Button
                                  type="button"
                                  onClick={handleCreateCategory}
                                  disabled={
                                    isCreatingCategory || !newCategory.trim()
                                  }
                                >
                                  {isCreatingCategory ? "..." : "Add"}
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <div>
                <FormLabel>Variants</FormLabel>
                <p className="text-sm text-muted-foreground mb-4">
                  Add size, color, or any other variant options for this product
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Variant name"
                    value={newVariant}
                    onChange={(e) => setNewVariant(e.target.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={newVariantStock}
                    onChange={(e) =>
                      setNewVariantStock(parseInt(e.target.value) || 0)
                    }
                    disabled={loading}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    onClick={addVariant}
                    disabled={loading || !newVariant.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md"
                  >
                    <span className="flex-1">{variant.name}</span>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariantStock(
                          variant.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={loading}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeVariant(variant.id)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {variants.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No variants added yet. Add at least one variant.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  );
}
