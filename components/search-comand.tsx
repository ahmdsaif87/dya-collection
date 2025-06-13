"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; // Import useRouter dari Next.js
import { Search } from "lucide-react"; // Hanya mengimpor ikon yang diperlukan

import { cn } from "@/lib/utils";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { page } from "./navbar";

export function SearchCommand({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter(); // Inisialisasi useRouter

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

  const handleItemClick = (href: string) => {
    router.push(href); // Navigasi ke href yang diberikan
    setOpen(false); // Tutup dialog setelah klik
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <Button variant={"ghost"} size={"icon"} onClick={() => setOpen(true)}>
        <Search />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Search">
            {page.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleItemClick(item.href)}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
