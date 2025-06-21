"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { SearchCommand } from "./search-comand";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartSheet } from "./cart-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";

export const page: { name: string; href: string }[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Produk",
    href: "/search",
  },
  {
    name: "Tentang Kami",
    href: "/about",
  },
  {
    name: "Kontak",
    href: "/contact",
  },
];

interface User {
  id: string;
  fullName?: string | null;
  imageUrl?: string;
  email?: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <header className="sticky px-5 top-0 z-50  w-full bg-background">
      <div>
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="flex space-x-6 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl uppercase">
                Dya Collection
              </span>
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center gap-4">
              {page.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  className={cn(
                    "text-sm font-medium hover:text-primary px-2",
                    pathname === item.href && "font-bold"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <SearchCommand />
            {/* Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Log in</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton user={user} />
            </SignedIn>
            <CartSheet />
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-4 px-2 pb-3 pt-2">
              {page.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  className="block px-2 py-1 text-sm font-medium hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function UserButton({ user }: { user: User | undefined | null }) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Image
            src={user?.imageUrl || "/placeholder.png"}
            alt={user?.fullName || "User"}
            fill
            className="rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton>Sign out</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
