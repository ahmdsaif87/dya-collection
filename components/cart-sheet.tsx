"use client";

import * as React from "react";
import { ShoppingCart, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CldImage } from "next-cloudinary";
import { useAuth } from "@clerk/nextjs";

export function CartSheet() {
  const { items } = useCart();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const { userId } = useAuth();

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    setPendingAction(`update-${id}`);
    await updateQuantity(id, quantity);
    setPendingAction(null);
  };

  const handleRemoveItem = async (id: string) => {
    setPendingAction(`remove-${id}`);
    await removeItem(id);
    setPendingAction(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-card rounded-full"
        >
          <ShoppingCart className="w-4 h-4" />
          {userId && items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>keranjang</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 h-70">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-50 gap-4">
              <ShoppingCart className="w-20 h-20" />
              <p className="text-muted-foreground mb-4 text-2xl font-bold">
                keranjang kamu kosong
              </p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Lanjutkan Belanja
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {items.map((item) => {
                if (!item.product) {
                  return null; // Skip rendering if product data is missing
                }
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 relative mx-4 border-b pb-4 "
                  >
                    <div className=" aspect-square h-20 border rounded-md relative ">
                      <CldImage
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        removeBackground={true}
                        className="object-cover rounded-md"
                      />

                      <button
                        className="absolute z-10 -top-2 -left-2 text-muted-foreground hover:text-foreground rounded-full p-1.5 border bg-muted shadow"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={pendingAction === `remove-${item.id}`}
                      >
                        {pendingAction === `remove-${item.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 space-y-1 ">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium leading-none">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.productVariant.name}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="absolute bottom-5 -right-1 items-center gap-2">
                        <div className="flex items-center rounded-full border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-full"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={
                              pendingAction === `update-${item.id}` ||
                              item.quantity <= 1
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-full"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={
                              pendingAction === `update-${item.id}` ||
                              item.quantity >= item.productVariant.stock
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <SheetFooter>
          {items.length > 0 && (
            <div className="border-t pt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
              <Button
                className="w-full h-11"
                size="lg"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/checkout";
                }}
              >
                Lanjutkan ke Pembayaran
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
