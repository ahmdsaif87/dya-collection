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

export default function Footer() {
  return (
    <footer>
      <div className="mx-5 p-10  border bg-foreground  rounded-2xl">
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="space-y-2 text-md">
              <div className="flex items-center space-x-2  text-background font-medium">
                <Phone className="h-4 w-4" />
                <span>+62 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2  text-background font-medium">
                <Mail className="h-4 w-4" />
                <span>support@dya.com</span>
              </div>
              <div className="flex items-center space-x-2  text-background font-medium">
                <MapPin className="h-4 w-4" />
                <span>Jl. Raya Tegal</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-medium  text-background/70">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                About Us
              </Link>
              <Link
                href="/products"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                All Products
              </Link>
              <Link
                href="/deals"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Special Deals
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Blog
              </Link>
              <Link
                href="/careers"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-medium text-background/70">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Contact Us
              </Link>
              <Link
                href="/faq"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                FAQ
              </Link>
              <Link
                href="/shipping"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/track-order"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Track Your Order
              </Link>
              <Link
                href="/size-guide"
                className="block text-sm text-background font-medium hover:text-background/70"
              >
                Size Guide
              </Link>
            </div>
          </div>
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-background">ShopHub</span>
            </div>
            <p className="text-sm text-background font-medium">
              Your trusted online marketplace for quality products at great
              prices. Shop with confidence and enjoy fast, reliable delivery.
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
            © 2024 ShopHub. All rights reserved.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-foreground font-medium">
            We accept:
          </span>
          <div className="flex space-x-2">
            <Badge>
              <span className="text-xs font-bold">VISA</span>
            </Badge>
            <Badge>
              <span className="text-xs font-bold">MC</span>
            </Badge>
            <Badge>
              <span className="text-xs font-bold">PP</span>
            </Badge>
            <Badge>
              <span className="text-xs font-bold">GPay</span>
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
