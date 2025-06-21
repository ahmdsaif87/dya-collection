"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SearchCommand } from "@/components/search-comand";
import { cn } from "@/lib/utils";
import { CartSheet } from "@/components/cart-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface NavItem {
  name: string;
  href: string;
}

const navigationItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Produk", href: "/search" },
  { name: "Tentang Kami", href: "/about" },
  { name: "Kontak", href: "/contact" },
];

function NavigationLink({
  item,
  isMobile = false,
}: {
  item: NavItem;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "transition-colors hover:text-primary ",
        isActive ? "font-bold text-primary" : "text-muted-foreground",
        isMobile && "block w-full p-2 text-base"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {item.name}
    </Link>
  );
}

export function MobileNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <nav className="flex flex-col space-y-4">
          {navigationItems.map((item) => (
            <NavigationLink key={item.href} item={item} isMobile />
          ))}
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ClientNavbar() {
  return (
    <div className="flex items-center space-x-4">

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <SignedIn>
          <Link href="/orders">
            <Button variant="outline" className="rounded-full">
              Pesanan
            </Button>
          </Link>
        </SignedIn>

        <SearchCommand />

        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="default" className="rounded-full">
              Login
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </SignedIn>

        <CartSheet />
      </div>
    </div>
  );
}

export function ClientNavbarMobile() {
  return (
    <div className="flex items-center space-x-4">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navigationItems.map((item) => (
          <NavigationLink key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );
}
