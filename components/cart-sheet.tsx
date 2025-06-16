"use client";

import * as React from "react";
import Image from "next/image";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export function CartSheet() {
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const { items, isLoading, fetchCart, updateQuantity, removeItem, getTotal } =
    useCartStore();

  useEffect(() => {
    if (isSignedIn && isOpen) {
      fetchCart().catch(() => {
        toast.error("Failed to fetch cart items");
      });
    }
  }, [isSignedIn, isOpen, fetchCart]);

  const handleUpdateQuantity = async (itemId: string, change: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(0, item.quantity + change);

    try {
      if (newQuantity === 0) {
        await removeItem(itemId);
      } else {
        await updateQuantity(itemId, newQuantity);
      }
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0">
              {items.reduce((total, item) => total + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="p-10 flex w-full flex-col  sm:max-w-lg">
        <SheetHeader className="space-y-2.5">
          <SheetTitle>Cart ({items.length})</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground">Loading cart...</span>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="flex flex-1 flex-col gap-4 overflow-auto">
              {items.map((item) => (
                <div key={item.id} className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="absolute object-cover"
                        />
                      </div>
                      <div className="flex flex-col space-y-1 self-start">
                        <span className="line-clamp-1 text-sm font-medium">
                          {item.product.name}
                        </span>
                        {item.product.variant.length > 0 && (
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {item.product.variant.length} variants available
                          </span>
                        )}
                        <span className="line-clamp-1 text-sm font-medium">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 items-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Remove one</span>
                        </Button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Add one</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Shipping</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taxes</span>
                  <span className="text-sm">{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <ShoppingCart
              className="h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-lg font-medium">Your cart is empty</span>
            <Button variant="link" onClick={() => setIsOpen(false)}>
              Continue shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
