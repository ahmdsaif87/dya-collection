import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductVariant {
  id: string;
  name: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  variant: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  productVariantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

interface CartStore {
  items: CartItem[];
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  addItem: (item: {
    productId: string;
    productVariantId: string;
    quantity: number;
    product: Product;
    variant: ProductVariant;
  }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  syncWithBackend: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isAuthenticated: false,
      setIsAuthenticated: (value) => {
        set({ isAuthenticated: value });
        if (value) {
          // Silently sync with backend when authenticated
          get().syncWithBackend();
        }
      },

      syncWithBackend: async () => {
        try {
          const response = await fetch("/api/cart");
          if (!response.ok) return;

          const backendItems = await response.json();
          // Only update state if there are items in backend
          if (backendItems.length > 0) {
            set({ items: backendItems });
          }
        } catch (error) {
          console.error("Error syncing with backend:", error);
        }
      },

      addItem: (item) => {
        const tempId = `temp-${Date.now()}`;
        const existingItem = get().items.find(
          (i) =>
            i.productId === item.productId &&
            i.productVariantId === item.productVariantId
        );

        if (existingItem) {
          // Update quantity if item exists
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId &&
              i.productVariantId === item.productVariantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));

          // Sync to database
          fetch("/api/cart", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: existingItem.id,
              quantity: existingItem.quantity + item.quantity,
            }),
          });
        } else {
          // Add new item to state
          const newItem = {
            ...item,
            id: tempId,
          };

          set((state) => ({
            items: [...state.items, newItem],
          }));

          // Sync to database
          fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              productVariantId: item.productVariantId,
              quantity: item.quantity,
            }),
          });
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));

        fetch(`/api/cart?id=${id}`, {
          method: "DELETE",
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));

        fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, quantity }),
        });
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
