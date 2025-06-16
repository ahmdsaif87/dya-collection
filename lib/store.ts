import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  variant: {
    id: string;
    name: string;
    stock: number;
  }[];
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotal: () => number;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch("/api/cart");
          if (!response.ok) throw new Error("Failed to fetch cart");
          const items = await response.json();
          set({ items });
        } catch (error) {
          console.error("Error fetching cart:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (item) => {
        try {
          set({ isLoading: true });
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity,
            }),
          });

          if (!response.ok) throw new Error("Failed to add item to cart");

          const updatedItem = await response.json();
          const items = get().items;
          const existingItemIndex = items.findIndex(
            (i) => i.id === updatedItem.id
          );

          if (existingItemIndex > -1) {
            set({
              items: items.map((i, index) =>
                index === existingItemIndex ? updatedItem : i
              ),
            });
          } else {
            set({ items: [...items, updatedItem] });
          }
        } catch (error) {
          console.error("Error adding item to cart:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        try {
          set({ isLoading: true });
          const response = await fetch(`/api/cart?id=${itemId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to remove item from cart");

          set((state) => ({
            items: state.items.filter((i) => i.id !== itemId),
          }));
        } catch (error) {
          console.error("Error removing item from cart:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        try {
          set({ isLoading: true });
          const response = await fetch("/api/cart", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: itemId, quantity }),
          });

          if (!response.ok) throw new Error("Failed to update cart item");

          const updatedItem = await response.json();
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? updatedItem : item
            ),
          }));
        } catch (error) {
          console.error("Error updating cart item:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const items = get().items;
        return items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
