"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Address, CartItem } from "@prisma/client";
import { AddressSelector } from "@/components/address-selector";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store";

interface ExtendedCartItem extends CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  productVariant: {
    id: string;
    name: string;
  };
}

interface CheckoutFormProps {
  addresses: Address[];
  cartItems: ExtendedCartItem[];
}

export function CheckoutForm({ addresses, cartItems }: CheckoutFormProps) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const onSubmit = async () => {
    if (!selectedAddressId) {
      toast.error("Silakan pilih alamat pengiriman");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: cartItems,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const order = await response.json();
      clearCart();
      toast.success("Pesanan berhasil dibuat");
      router.push(`/payment/${order.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AddressSelector
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelect={setSelectedAddressId}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b"
            >
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.productVariant.name} x {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">{formatPrice(total)}</p>
          </div>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        className="w-full"
        size="lg"
        disabled={!selectedAddressId || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Placing Order...
          </>
        ) : (
          `Place Order - ${formatPrice(total)}`
        )}
      </Button>
    </div>
  );
}
