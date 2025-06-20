"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Address } from "@prisma/client";
import { AddressForm } from "./address-form";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId?: string;
  onSelect: (addressId: string) => void;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
}: AddressSelectorProps) {
  const [showForm, setShowForm] = useState(false);

  if (addresses.length === 0 || showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add New Address</h2>
          {showForm && (
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          )}
        </div>
        <AddressForm />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Shipping Address</h2>
        <Button variant="outline" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <RadioGroup
        defaultValue={selectedAddressId}
        onValueChange={onSelect}
        className="space-y-2"
      >
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex items-center space-x-2 border rounded-lg p-4"
          >
            <RadioGroupItem value={address.id} id={address.id} />
            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
              <div>
                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {address.street}, {address.city}, {address.province}{" "}
                  {address.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.country}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
