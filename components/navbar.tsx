"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const page: { name: string; href: string }[] = [
    {
      name: "Produk",
      href: "/products",
    },

    {
      name: "Diskon",
      href: "/discount",
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

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="px-5">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="flex space-x-6 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  S
                </span>
              </div>
              <span className="font-bold text-xl">Dyah Colection</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {page.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  className="text-sm font-medium hover:text-primary "
                >
                  {item.name}
                </Link>
              ))}
              <div className="relative pl-10">
                <Input
                  type="search"
                  placeholder="Cari produk..."
                  className="md:w-70  bg-muted border-none"
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0">
                0
              </Badge>
            </Button>
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
              {/* Mobile Search */}
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Cari produk..."
                  className="w-full pl-10 bg-muted border-none"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

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
