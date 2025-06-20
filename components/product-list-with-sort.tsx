"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductList } from "./product-list";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "trending", label: "Trending" },
  { value: "latest", label: "Latest arrivals" },
  { value: "price_desc", label: "Price: High to low" },
  { value: "price_asc", label: "Price: Low to high" },
];

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

interface ProductListWithSortProps {
  categoryFilter?: string;
  className?: string;
  excludeProduct?: string;
}

export function ProductListWithSort({
  categoryFilter,
  className,
  excludeProduct,
}: ProductListWithSortProps) {
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pathname = usePathname();
  const router = useRouter();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get current category from pathname or props
  const currentSlug =
    categoryFilter ||
    (pathname.startsWith("/search/") ? pathname.split("/")[2] : "all");

  // Find the current category name from the slug
  const currentCategory =
    currentSlug === "all"
      ? "all"
      : categories?.find(
          (cat) => generateCategorySlug(cat.name) === currentSlug
        )?.name || currentSlug;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="w-full flex gap-2">
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
            <SelectTrigger>
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

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductList
        categoryFilter={categoryFilter}
        sortBy={sort}
        page={page}
        onPageChange={setTotalPages}
        className={className}
        excludeProduct={excludeProduct}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
