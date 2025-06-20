"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { page } from "./navbar";
import { Badge } from "./ui/badge";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  slug: string;
  variant: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
}

interface SearchResponse {
  products: Product[];
  total: number;
  hasMore: boolean;
}

async function searchProducts(query: string): Promise<SearchResponse> {
  const response = await fetch(
    `/api/products?search=${encodeURIComponent(query)}&limit=5`
  );
  if (!response.ok) {
    throw new Error("Failed to search products");
  }
  return response.json();
}

export function SearchCommand({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ["search", query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = React.useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleProductSelect = React.useCallback(
    (product: Product) => {
      router.push(`/products/${product.slug}`);
      setOpen(false);
      setQuery("");
    },
    [router]
  );

  const handleNavigationSelect = React.useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
      setQuery("");
    },
    [router]
  );

  return (
    <div className={cn("relative", className)} {...props}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Navigation Links */}
          <CommandGroup heading="Quick Navigation">
            {page.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleNavigationSelect(item.href)}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Products */}
          {query.length > 0 && (
            <CommandGroup heading="Products">
              {isLoading && (
                <CommandLoading>Searching products...</CommandLoading>
              )}

              {error && (
                <CommandItem disabled>
                  Error searching products. Please try again.
                </CommandItem>
              )}

              {data?.products.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleProductSelect(product)}
                  className="flex items-center gap-3 p-2"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                    <Badge variant="outline" className="w-fit">
                      {formatPrice(product.price)}
                    </Badge>
                  </div>
                </CommandItem>
              ))}

              {data?.hasMore && (
                <CommandItem
                  onSelect={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="italic text-muted-foreground"
                >
                  View all results...
                </CommandItem>
              )}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
