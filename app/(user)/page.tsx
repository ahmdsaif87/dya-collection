import Hero from "@/components/hero";
import { ProductList } from "@/components/product-list";
import ProductCategory from "@/components/product-category";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-5 py-16 space-y-16">
        <section>
          <div className="flex flex-col gap-2 mb-8 text-center">
            <h2 className="text-2xl font-light">Kategori Produk</h2>
            <p className="text-sm text-muted-foreground">
              Kategori produk yang kami sediakan
            </p>
          </div>
          <ProductCategory />
        </section>

        <section>
          <div className="flex flex-col gap-2 mb-8 text-center">
            <h2 className="text-2xl font-light">Produk Unggulan</h2>
            <p className="text-sm text-muted-foreground">
              Produk yang kami unggulkan untuk Anda
            </p>
          </div>
          <ProductList />
        </section>
      </div>
    </main>
  );
}
