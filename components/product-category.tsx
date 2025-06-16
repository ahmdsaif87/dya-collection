import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  _count: {
    products: number;
  };
}

export default function ProductCategory() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center">
        <ul className="flex flex-wrap justify-center gap-2">
          {categories?.map((category) => (
            <li key={category.id}>
              <Link
                href={`/kategori/${encodeURIComponent(
                  category.name.toLowerCase().replace(/\s+/g, "-")
                )}`}
                className="px-4 py-2 rounded-full bg-black-200 border text-white-800 hover:bg-white-300 transition-colors text-sm"
              >
                {category.name}
                {category._count.products > 0 && (
                  <span className="ml-2 text-xs opacity-70">
                    ({category._count.products})
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
