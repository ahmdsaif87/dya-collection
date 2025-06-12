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

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className=" px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl">ShopHub</span>
            </div>
            <p className="text-sm text-gray-600">
              Your trusted online marketplace for quality products at great
              prices. Shop with confidence and enjoy fast, reliable delivery.
            </p>
            <div className="flex space-x-4">
              <button className="p-2 hover:bg-gray-200 rounded-md">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-md">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-md">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-md">
                <Youtube className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                About Us
              </Link>
              <Link
                href="/products"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                All Products
              </Link>
              <Link
                href="/deals"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                Special Deals
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                Blog
              </Link>
              <Link
                href="/careers"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                Contact Us
              </Link>
              <Link
                href="/faq"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                FAQ
              </Link>
              <Link
                href="/shipping"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/track-order"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                Track Your Order
              </Link>
              <Link
                href="/size-guide"
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                Size Guide
              </Link>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Connected</h3>
            <p className="text-sm text-gray-600">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <div className="flex space-x-2">
              <input
                placeholder="Enter your email"
                className="flex-1 h-9 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Subscribe
              </button>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>support@shophub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>123 Commerce St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-gray-600">
              © 2024 ShopHub. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">We accept:</span>
            <div className="flex space-x-2">
              <div className="h-6 w-10 bg-gray-200 rounded border flex items-center justify-center">
                <span className="text-xs font-bold">VISA</span>
              </div>
              <div className="h-6 w-10 bg-gray-200 rounded border flex items-center justify-center">
                <span className="text-xs font-bold">MC</span>
              </div>
              <div className="h-6 w-10 bg-gray-200 rounded border flex items-center justify-center">
                <span className="text-xs font-bold">PP</span>
              </div>
              <div className="h-6 w-10 bg-gray-200 rounded border flex items-center justify-center">
                <span className="text-xs font-bold">GPay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
