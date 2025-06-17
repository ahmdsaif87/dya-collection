import Hero from "@/components/hero";
import { ProductList } from "@/components/product-list";
import ProductCategory from "@/components/product-category";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-5 py-16 space-y-16">
        <section>
          <ProductCategory />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium">Featured Products</h2>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all products →
            </Link>
          </div>
          <ProductList />
        </section>
      </div>
    </main>
  );
}
