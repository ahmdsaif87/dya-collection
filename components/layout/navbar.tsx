import { checkRole } from "@/lib/roles";
import Link from "next/link";
import ClientNavbar, { ClientNavbarMobile, MobileNav } from "./client-navbar";
import { Button } from "../ui/button";
import { UserButton } from "@clerk/nextjs";

export default async function Navbar() {
  const isAdmin = await checkRole("admin");

  return (
    <header className="sticky top-0 z-50 w-full bg-background px-5 border-b">
      <div className=" flex h-16 items-center">
        {/* Brand Logo */}
        <Link
          href="/"
          className="mr-6 flex items-center space-x-2"
          aria-label="Dya Collection Home"
        >
          <span className="font-bold text-xl uppercase hidden md:inline-block">
            Dya Collection
          </span>
          <span className="font-bold text-xl uppercase md:hidden">DYC</span>
        </Link>

        {/* Navigation */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ClientNavbarMobile />
          {isAdmin ? (
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button
                  variant="outline"
                  className="rounded-full"
                  aria-label="Admin Dashboard"
                >
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </div>
          ) : (
            <ClientNavbar />
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
