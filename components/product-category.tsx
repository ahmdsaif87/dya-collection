"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

const getCategories = async () => {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

export default function ProductCategory() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center">
        <ul className="flex flex-wrap justify-center gap-2">
          {categories?.map((category) => (
            <li key={category.id}>
              <Link
                href={`/kategori/${encodeURIComponent(
                  category.name.toLowerCase().replace(/\s+/g, "-")
                )}`}
                className="px-4 py-2 rounded-full bg-black-200 border text-white-800 hover:bg-white-300 transition-colors text-sm"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProductCategoryLink() {
  const pathname = usePathname();
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) {
    return (
      <div className="w-64 p-6">
        <h2 className="text-xl font-semibold mb-4">Collections</h2>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-50 p-6  min-h-screen  ">
      <h2 className="text-sm text-muted-foreground  mb-4">Collections</h2>
      <div className="flex flex-col space-y-3">
        <Link
          href="/products"
          className={`text-sm ${pathname === "/products" ? "underline" : ""}`}
        >
          All
        </Link>
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/kategori/${encodeURIComponent(
              category.name.toLowerCase().replace(/\s+/g, "-")
            )}`}
            className={`text-sm ${
              pathname ===
              `/kategori/${encodeURIComponent(
                category.name.toLowerCase().replace(/\s+/g, "-")
              )}`
                ? "underline"
                : ""
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
