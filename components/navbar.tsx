"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, User, X } from "lucide-react";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <header className="sticky px-5 top-0 z-50 w-full bg-background">
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
              <SearchCommand />
            </div>
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

const UserButton = ({ user }: { user: any }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Image
        src={user.imageUrl}
        alt={user.fullName}
        width={32}
        height={32}
        className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1 leading-none">
          <p className="font-medium">{user.fullName}</p>
          <p className="text-xs text-muted-foreground">
            {user.emailAddresses[0].emailAddress}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href={"/orders"} className="cursor-pointer w-full">
          Pesanan Saya
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/user-profile" className="cursor-pointer w-full">
          Akun Saya
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SignOutButton>Keluar</SignOutButton>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
