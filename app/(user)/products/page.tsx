import { ProductCategoryLink } from "@/components/product-category";
import { ProductList } from "@/components/product-list";

export default async function ProductsPage() {
  return (
    <main className="flex min-h-screen">
      <ProductCategoryLink />
      <div className="flex-1 p-6">
        <ProductList />
      </div>
    </main>
  );
}
