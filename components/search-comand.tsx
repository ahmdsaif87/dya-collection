"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface Variant {
  id: string;
  productId: string;
  name: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  variant: Variant[];
  slug: string;
}

export function SearchCommand() {
  const router = useRouter();
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["products-search"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/products?limit=100");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        return data.products as Product[];
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
  });

  const products = React.useMemo(() => data || [], [data]);

  const fuse = React.useMemo(() => {
    if (!products.length) return null;
    return new Fuse(products, {
      keys: [{ name: "name", weight: 1 }],
      threshold: 0.2,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [products]);

  const searchResults = React.useMemo(() => {
    if (!products.length) return [];

    // Show first 10 products when no search
    if (!inputValue.trim()) {
      return products.slice(0, 10);
    }

    if (!fuse) return [];

    const results = fuse.search(inputValue.toLowerCase());
    return results
      .filter((result) => result.score && result.score < 0.3)
      .slice(0, 10)
      .map((result) => result.item);
  }, [fuse, inputValue, products]);

  // Handle keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-2 w-full rounded-full"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <kbd className="pointer-events-none  h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 ">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Cari produk..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : searchResults.length === 0 ? (
              <CommandEmpty>Tidak ada produk ditemukan.</CommandEmpty>
            ) : (
              <CommandGroup>
                {searchResults.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => {
                      router.push(`/products/${product.slug}`);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Rp. {(product.price / 100).toFixed(2)} -{" "}
                          {product.category.name}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
