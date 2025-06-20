"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, MessageSquare } from "lucide-react";
interface PaymentOptionsProps {
  order: Order;
}

export function PaymentOptions({ order }: PaymentOptionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDirectPayment = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/orders/${order.id}/pay`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Pembayaran gagal");
      }

      toast.success("Pembayaran berhasil");
      router.push(`/orders/${order.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppPayment = () => {
    // Format pesan WhatsApp
    const message = `Halo, saya ingin melakukan pembayaran untuk pesanan:
    
Order ID: #${order.id.slice(-8)}
Total: Rp ${order.total.toLocaleString("id-ID")}

Mohon kirimkan instruksi pembayarannya. Terima kasih!`;

    // Nomor WhatsApp admin (ganti dengan nomor yang sebenarnya)
    const phoneNumber = "6285157739978";

    // Buat URL WhatsApp dengan pesan yang sudah di-encode
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, "_blank");

    toast.success("Mengarahkan ke WhatsApp...");
  };

  return (
    <div className="space-y-4 pt-6">
      <div className="space-y-2">
        <h2 className="font-medium">Pilih Metode Pembayaran:</h2>
        <p className="text-sm text-muted-foreground">
          Pilih salah satu metode pembayaran di bawah ini
        </p>
      </div>

      <div className="grid gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 flex gap-4"
          onClick={handleWhatsAppPayment}
        >
          <MessageSquare className="h-5 w-5 text-green-500" />
          <div className="flex-1 text-left">
            <p className="font-medium">Bayar via WhatsApp</p>
            <p className="text-sm text-muted-foreground">
              Chat dengan admin untuk instruksi pembayaran
            </p>
          </div>
        </Button>

        <Button
          className="h-auto py-4"
          onClick={handleDirectPayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses Pembayaran...
            </>
          ) : (
            <>
              <span className="flex-1">Bayar Langsung</span>
              <span className="font-medium">
                Rp {order.total.toLocaleString("id-ID")}
              </span>
            </>
          )}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground text-center pt-4">
        Pembayaran aman dan terjamin
      </p>
    </div>
  );
}
