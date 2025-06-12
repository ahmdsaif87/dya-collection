"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-5">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                S
              </span>
            </div>
            <span className="font-bold text-xl">Dyah Colection</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium hover:text-primary transition-colors">
                Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Electronics</DropdownMenuItem>
                <DropdownMenuItem>Fashion</DropdownMenuItem>
                <DropdownMenuItem>Home & Garden</DropdownMenuItem>
                <DropdownMenuItem>Sports</DropdownMenuItem>
                <DropdownMenuItem>Books</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="/deals"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Sign In</DropdownMenuItem>
                <DropdownMenuItem>Create Account</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>My Orders</DropdownMenuItem>
                <DropdownMenuItem>Wishlist</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              <div className="px-2 pb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full"
                  />
                </div>
              </div>
              <Link
                href="/"
                className="px-2 py-1 text-sm font-medium hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="px-2 py-1 text-sm font-medium hover:text-primary"
              >
                Categories
              </Link>
              <Link
                href="/products"
                className="px-2 py-1 text-sm font-medium hover:text-primary"
              >
                Products
              </Link>
              <Link
                href="/deals"
                className="px-2 py-1 text-sm font-medium hover:text-primary"
              >
                Deals
              </Link>
              <Link
                href="/about"
                className="px-2 py-1 text-sm font-medium hover:text-primary"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-2 py-1 text-sm font-medium hover:text-primary"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
