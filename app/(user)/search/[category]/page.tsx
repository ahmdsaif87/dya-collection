import { ProductCategoryLink } from "@/components/product-category";
import { ProductList } from "@/components/product-list";
import { notFound } from "next/navigation";

interface SearchCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function SearchCategoryPage({
  params,
}: SearchCategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  // If category is not valid, show 404
  if (!decodedCategory) {
    notFound();
  }
  
  return (
    <main className="flex min-h-screen">
      <ProductCategoryLink />
      <div className="flex-1 p-6">
        <ProductList categoryFilter={decodedCategory} />
      </div>
    </main>
  );
}
