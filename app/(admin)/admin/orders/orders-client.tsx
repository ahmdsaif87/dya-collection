"use client";

import { DataTable } from "@/components/data-table";
import { columns, OrderColumn } from "./columns";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface OrdersClientProps {
  data: OrderColumn[];
}

async function getOrders(): Promise<OrderColumn[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  const data = await response.json();
  return data;
}

export default function OrdersClient({ data: initialData }: OrdersClientProps) {
  const queryClient = useQueryClient();
  const [orders, setOrders] = useState(initialData);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
    },
    onError: (error, variables) => {
      // Rollback on error
      setOrders((prev) =>
        prev.map((order) =>
          order.id === variables.id ? { ...order, status: order.status } : order
        )
      );
      toast.error("Gagal memperbarui status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
    },
    onSuccess: (_, id) => {
      setOrders((prev) => prev.filter((order) => order.id !== id));
      toast.success("Order berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus order");
    },
  });

  const updateStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      try {
        // Update local state immediately
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? { ...order, status } : order))
        );

        // Then update server
        await updateStatusMutation.mutateAsync({ id, status });
        toast.success("Status berhasil diperbarui");
      } catch (error) {
        console.error(error);
      }
    },
    [updateStatusMutation]
  );

  const onDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DataTable
      columns={columns}
      data={orders}
      searchKey="customerName"
      onDelete={onDelete}
      meta={{ updateStatus }}
      key={orders.length}
    />
  );
}
