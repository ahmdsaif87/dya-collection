import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface ProductVariant {
  id: string;
  name: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  variant: ProductVariant[];
  slug?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productVariantId: string;
  quantity: number;
  product: Omit<Product, "variant">;
  productVariant: ProductVariant;
}

type AddToCartInput = Omit<CartItem, "id">;

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: AddToCartInput) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotal: () => number;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      setItems: (items) => {
        set({ items });
      },

      addItem: async (item) => {
        const existingItem = get().items.find(
          (i) =>
            i.productId === item.productId &&
            i.productVariantId === item.productVariantId
        );

        if (existingItem) {
          return get().updateQuantity(
            existingItem.id,
            existingItem.quantity + item.quantity
          );
        }

        // Add new item optimistically with a temporary ID
        const tempId = `temp-${Date.now()}`;
        const tempItem = {
          ...item,
          id: tempId,
        };

        set((state) => ({
          items: [...state.items, tempItem],
        }));

        try {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              productVariantId: item.productVariantId,
              quantity: item.quantity,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to add item to cart");
          }

          const savedItem = await response.json();

          // Replace temp item with saved item
          set((state) => ({
            items: state.items.map((i) => (i.id === tempId ? savedItem : i)),
          }));
        } catch (error) {
          // Remove temp item on error
          set((state) => ({
            items: state.items.filter((i) => i.id !== tempId),
          }));
          toast.error(
            error instanceof Error ? error.message : "Failed to add item"
          );
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(id);
        }

        const originalItems = get().items;
        const item = originalItems.find((i) => i.id === id);

        if (!item) {
          toast.error("Item not found");
          return;
        }

        // Update optimistically
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));

        try {
          // Only make API call for non-temporary items
          if (!id.startsWith("temp-")) {
            const response = await fetch("/api/cart", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, quantity }),
            });

            if (!response.ok) {
              throw new Error("Failed to update quantity");
            }
          }
        } catch (error) {
          // Revert on error
          set({ items: originalItems });
          toast.error(
            error instanceof Error ? error.message : "Failed to update quantity"
          );
        }
      },

      removeItem: async (id) => {
        const originalItems = get().items;

        // Remove optimistically
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));

        try {
          const response = await fetch(`/api/cart?id=${id}`, {
            method: "DELETE",
          });

          if (!response.ok && !id.startsWith("temp-")) {
            throw new Error("Failed to remove item");
          }
        } catch (error) {
          // Revert on error
          set({ items: originalItems });
          toast.error(
            error instanceof Error ? error.message : "Failed to remove item"
          );
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce(
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
