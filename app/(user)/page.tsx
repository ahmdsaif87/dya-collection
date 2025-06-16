import Hero from "@/components/hero";
import { ProductList } from "@/components/product-list";
import ProductCategory from "@/components/product-category";

export default function HomePage() {
  return (
    <main>
      <Hero />

      <div className="container mx-auto px-4 py-16 space-y-16">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium">Shop by Category</h2>
            <a
              href="/categories"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all categories →
            </a>
          </div>
          <ProductCategory />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium">Featured Products</h2>
            <a
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all products →
            </a>
          </div>
          <ProductList />
        </section>
      </div>
    </main>
  );
}
