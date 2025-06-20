import { ProductListWithSort } from "@/components/product-list-with-sort";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-block gap-8">
      <div className="flex gap-8">
        <div className="flex-1">
          <ProductListWithSort className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3" />
        </div>
      </div>
    </div>
  );
}
