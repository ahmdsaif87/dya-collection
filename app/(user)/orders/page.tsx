import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrderList } from "@/app/(user)/orders/order-list";

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container max-w-4xl py-8 px-5 mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-light"> Pesanan Saya </h1>
          <p className="text-muted-foreground">
            Lihat status dan riwayat pesanan Anda
          </p>
        </div>
        <OrderList />
      </div>
    </div>
  );
}
