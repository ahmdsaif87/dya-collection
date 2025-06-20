"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AddressForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          street: formData.get("street"),
          city: formData.get("city"),
          province: formData.get("province"),
          postalCode: formData.get("postalCode"),
          country: formData.get("country"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add address");
      }

      toast.success("Address added successfully");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          name="name"
          placeholder="Full Name"
          required
          disabled={isLoading}
        />
        <Input
          name="phone"
          placeholder="Phone Number"
          required
          disabled={isLoading}
        />
        <Input
          name="street"
          placeholder="Street Address"
          required
          disabled={isLoading}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input name="city" placeholder="City" required disabled={isLoading} />
          <Input
            name="province"
            placeholder="Province"
            required
            disabled={isLoading}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            name="postalCode"
            placeholder="Postal Code"
            required
            disabled={isLoading}
          />
          <Input
            name="country"
            placeholder="Country"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Address...
          </>
        ) : (
          "Add Address"
        )}
      </Button>
    </form>
  );
}
