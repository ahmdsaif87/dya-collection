"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Category {
  id: string;
  name: string;
}

// Helper function to generate slug from category name
function generateCategorySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
        <div className="text-center flex flex-wrap gap-2 justify-center items-center">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center flex flex-wrap gap-2 justify-center items-center">
        {categories?.map((category) => (
          <Badge key={category.id} variant="outline" className="rounded-full">
            <Link
              href={`/search/${generateCategorySlug(category.name)}`}
              className="px-4 py-2 text-sm"
            >
              {category.name}
            </Link>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ProductCategoryLink() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) {
    return (
      <div className="w-50 p-6">
        <h2 className="text-sm text-muted-foreground mb-4">Collections</h2>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Get current category from pathname
  const currentCategory = pathname.startsWith("/search/")
    ? pathname.split("/")[2]
    : "all";

  return (
    <div className="w-50 p-6">
      {/* Desktop View */}
      <div className="hidden md:block min-h-screen">
        <h2 className="text-sm text-muted-foreground mb-4">Collections</h2>
        <div className="flex flex-col space-y-3">
          <Link
            href="/search"
            className={`text-sm hover:text-primary transition-colors ${
              pathname === "/search" ? "text-primary font-medium" : ""
            }`}
          >
            All
          </Link>
          {categories?.map((category) => {
            const slug = generateCategorySlug(category.name);
            return (
              <Link
                key={category.id}
                href={`/search/${slug}`}
                className={`text-sm hover:text-primary transition-colors ${
                  pathname === `/search/${slug}`
                    ? "text-primary font-medium"
                    : ""
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Select
          value={currentCategory}
          onValueChange={(value) => {
            if (value === "all") {
              router.push("/search");
            } else {
              router.push(`/search/${generateCategorySlug(value)}`);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
