import { ProductListWithSort } from "@/components/product-list-with-sort";

interface SearchCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function SearchCategoryPage({
  params,
}: SearchCategoryPageProps) {
  const { category } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1">
          <ProductListWithSort className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3" />
        </div>
      </div>
    </div>
  );
}
