"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Gagal membatalkan pesanan");
      }

      toast.success("Pesanan berhasil dibatalkan");

      // Jika status sebelumnya adalah PAID, kirim notifikasi ke admin via WhatsApp
      if (order.status === "PAID") {
        const message = `Halo Admin,
        
Pesanan dengan ID #${order.id.slice(-8)} telah dibatalkan oleh pembeli.

Total: Rp ${order.total.toLocaleString("id-ID")}

Mohon segera proses pengembalian dana. Terima kasih!`;

        // Nomor WhatsApp admin (ganti dengan nomor yang sebenarnya)
        const phoneNumber = "6285157739978";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappUrl, "_blank");
      }

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  // Jika status CANCELLED, SHIPPED, atau COMPLETED, tidak tampilkan action
  if (["CANCELLED", "SHIPPED", "COMPLETED"].includes(order.status)) {
    return null;
  }

  // Jika status PENDING, tampilkan tombol bayar dan batalkan
  if (order.status === "PENDING") {
    return (
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          className="flex-1"
          onClick={() => router.push(`/payment/${order.id}`)}
        >
          Bayar Sekarang
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Membatalkan...
                </>
              ) : (
                "Batalkan Pesanan"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Batalkan Pesanan?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini
                tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Tidak</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel}>Ya</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Jika status PAID, hanya tampilkan tombol batalkan
  if (order.status === "PAID") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Membatalkan...
              </>
            ) : (
              "Batalkan Pesanan & Minta Refund"
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Pesanan ini sudah dibayar. Jika Anda membatalkan pesanan, Anda
              akan diarahkan ke WhatsApp untuk menghubungi admin terkait
              pengembalian dana.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>
              Ya, Batalkan & Minta Refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
}
