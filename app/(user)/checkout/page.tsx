import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CheckoutForm } from "@/app/(user)/checkout/checkout-form";

export default async function CheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user's addresses
  const addresses = await prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get user's cart items
  const cartItems = await prisma.cartItem.findMany({
    where: {
      userId,
    },
    include: {
      product: true,
      productVariant: true,
    },
  });

  if (cartItems.length === 0) {
    redirect("/");
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">
            Lengkapi pesanan Anda dengan memilih alamat pengiriman
          </p>
        </div>
        <CheckoutForm addresses={addresses} cartItems={cartItems} />
      </div>
    </div>
  );
}
