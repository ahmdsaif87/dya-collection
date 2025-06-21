"use client";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";

const getCategories = async () => {
  const res = await fetch("/api/categories");
  return res.json();
};

function generateCategorySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Footer() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return (
    <footer>
      <div className="mx-5 p-10  border bg-foreground  rounded-2xl">
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="space-y-2 text-md">
              <div className="flex items-center space-x-2  text-background font-medium">
                <Phone className="h-4 w-4" />
                <span>+62 857-4714-5440</span>
              </div>
              <div className="flex items-center space-x-2  text-background font-medium">
                <Mail className="h-4 w-4" />
                <span>dyacollection@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2  text-background font-medium">
                <MapPin className="h-4 w-4" />
                <span>Jl. Raya Tegal, Jawa Tengah</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-medium  text-background/70">Menu</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Produk
              </Link>
              <Link
                href="/about"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Tentang Kami
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Kontak
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-background/70 mb-2">Koleksi</h3>
            <div className="space-y-2 flex flex-col">
              {categories?.map((category: Category) => (
                <Link
                  href={`/search/${generateCategorySlug(category.name)}`}
                  key={category.name}
                  className="block text-sm text-background font-medium hover:text-background/70"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl text-background">
                Dya Collection
              </span>
            </div>
            <p className="text-sm text-background font-medium">
              Toko fashion online terpercaya yang menyediakan berbagai macam
              pakaian wanita dengan kualitas terbaik dan harga terjangkau.
            </p>
            <div className="flex space-x-4">
              <Button
                variant={"ghost"}
                className="p-2 text-background rounded-md"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant={"ghost"}
                className="p-2 text-background rounded-md"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant={"ghost"}
                className="p-2 text-background rounded-md"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant={"ghost"}
                className="p-2 text-background rounded-md"
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 px-5 py-5">
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <p className="text-sm text-foreground font-medium">
            © 2024 Dya Collection. All rights reserved.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-foreground font-medium">
            Metode Pembayaran:
          </span>
          <div className="flex space-x-2">
            <Badge>
              <span className="text-xs font-bold">QRIS</span>
            </Badge>
            <Badge>
              <span className="text-xs font-bold">DANA</span>
            </Badge>
            <Badge>
              <span className="text-xs font-bold">OVO</span>
            </Badge>
            <Badge>
              <span className="text-xs font-bold">BANK</span>
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
