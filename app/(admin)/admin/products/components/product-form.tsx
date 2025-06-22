"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";
import {
  CldUploadWidget,
  CldImage,
  CldUploadWidgetResults,
} from "next-cloudinary";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CloudinaryGalleryDialog } from "./cloudinary-gallery-dialog";

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

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: Product;
  categories?: Category[];
}

interface CloudinaryUploadWidgetInfo {
  secure_url: string;
}

interface CloudinaryUploadWidgetResult {
  event: string;
  info: CloudinaryUploadWidgetInfo;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(
      /^[a-zA-Z0-9\s']+$/,
      "Name can only contain letters, numbers, spaces, and apostrophes. Hyphens are not allowed."
    )
    .transform((str) => str.trim()),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .url("Please provide a valid image URL"),
  categoryId: z.string().min(1, "Category is required"),
});

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
  const [galleryDialogOpen, setGalleryDialogOpen] = React.useState(false);

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

  const addVariant = React.useCallback(() => {
    if (
      newVariant.trim() &&
      !variants.find((v) => v.name === newVariant.trim())
    ) {
      setVariants((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newVariant.trim(),
          stock: newVariantStock,
        },
      ]);
      setNewVariant("");
      setNewVariantStock(0);
    }
  }, [newVariant, newVariantStock, variants]);

  const removeVariant = React.useCallback((variantId: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  }, []);

  const updateVariant = React.useCallback(
    (variantId: string, field: "name" | "stock", value: string | number) => {
      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? { ...v, [field]: field === "stock" ? Number(value) : value }
            : v
        )
      );
    },
    []
  );

  const handleCreateCategory = React.useCallback(async () => {
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
      setLocalCategories((prev) => [...prev, category]);
      form.setValue("categoryId", category.id);
      setNewCategory("");
      setIsNewCategoryOpen(false);
      toast.success("Kategori berhasil dibuat");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Gagal membuat kategori");
    } finally {
      setIsCreatingCategory(false);
    }
  }, [newCategory, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (variants.length === 0) {
        toast.error("Minimal satu varian produk harus diisi");
        return;
      }

      if (!values.imageUrl) {
        toast.error("Gambar produk harus diisi");
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
        const contentType = response.headers.get("content-type");
        let errorMessage = "Gagal menyimpan produk";

        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData || errorMessage;
        } else {
          errorMessage = await response.text();
        }

        throw new Error(errorMessage);
      }

      await response.json();

      router.push("/admin/products");
      toast.success(
        initialData
          ? "Produk berhasil diperbarui"
          : "Produk berhasil ditambahkan"
      );
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan produk"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Informasi Produk</h3>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Produk</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nama Produk"
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
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Deskripsi Produk"
                    disabled={loading}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Harga"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <div className="flex gap-2">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Kategori" />
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
                              Tambah Kategori Baru
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-4 w-80">
                            <div className="space-y-4">
                              <h4 className="font-medium">
                                Tambah Kategori Baru
                              </h4>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Nama Kategori"
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
                                  {isCreatingCategory ? "..." : "Tambah"}
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
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gambar</FormLabel>
                <div className="space-y-4">
                  <FormControl>
                    <div className="space-y-2 w-full">
                      {!field.value ? (
                        <div className="grid grid-cols-3 gap-2 border p-2 rounded-lg">
                          <CldUploadWidget
                            signatureEndpoint="/api/sign-cloudinary-params"
                            uploadPreset="dyaimage"
                            onSuccess={(results: CldUploadWidgetResults) => {
                              if (results.event !== "success") return;
                              field.onChange(results.info?.secure_url || "");
                              results.widget.close();
                            }}
                            onClose={() => {
                              document.body.style.overflow = "auto";
                            }}
                          >
                            {({ open }) => (
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => open?.()}
                              >
                                Upload Gambar
                              </Button>
                            )}
                          </CldUploadWidget>

                          <div className="text-center">atau</div>

                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setGalleryDialogOpen(true)}
                          >
                            Pilih dari Galeri Gambar
                          </Button>
                        </div>
                      ) : (
                        <div className="relative h-full w-full overflow-hidden rounded-lg border p-3 flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <CldImage
                              src={field.value}
                              alt="Product Image"
                              width={100}
                              height={100}
                              removeBackground={true}
                              className="object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => {
                                field.onChange("");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Separator />

          <div>
            <h2 className="text-lg font-medium mb-4">Varian</h2>
            <div className="space-y-4">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center space-x-4 bg-secondary/20 p-3 rounded-lg"
                >
                  <Input
                    placeholder="Nama Varian"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(variant.id, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(variant.id, "stock", e.target.value)
                    }
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeVariant(variant.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Nama Varian"
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Stock"
                  value={newVariantStock}
                  onChange={(e) => setNewVariantStock(parseInt(e.target.value))}
                  className="w-24"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addVariant}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Varian
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : initialData ? "Update" : "Simpan"}
          </Button>
        </div>
      </form>

      <CloudinaryGalleryDialog
        open={galleryDialogOpen}
        onOpenChange={setGalleryDialogOpen}
        onSelect={(imageUrl) => {
          form.setValue("imageUrl", imageUrl);
        }}
      />
    </Form>
  );
}
