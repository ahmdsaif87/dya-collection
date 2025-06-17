import { ProductCategoryLink } from "@/components/product-category";
import { ProductList } from "@/components/product-list";

export default async function SearchPage() {
  return (
    <main className="flex min-h-screen">
      <ProductCategoryLink />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">All Products</h1>
          <p className="text-sm text-muted-foreground">
            Browse our complete collection
          </p>
        </div>
        <ProductList />
      </div>
    </main>
  );
}
