import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/lib/store";

export const useCart = () => {
  const { items, setItems } = useCartStore();

  useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      setItems(data);
      return data;
    },
  });

  return {
    items,
  };
};
