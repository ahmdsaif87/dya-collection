"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryResource {
  secure_url: string;
  public_id: string;
}

interface CloudinarySearchResponse {
  resources: CloudinaryResource[];
}

interface CloudinaryGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageUrl: string) => void;
}

export function CloudinaryGalleryDialog({
  open,
  onOpenChange,
  onSelect,
}: CloudinaryGalleryDialogProps) {
  const [images, setImages] = React.useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const fetchImages = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cloudinary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "folder:dyaimage/*",
          max_results: 30,
          sort_by: [{ field: "created_at", value: "desc" }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data: CloudinarySearchResponse = await response.json();
      setImages(data.resources || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Gagal memuat gambar");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open, fetchImages]);

  const handleSelect = React.useCallback(
    (image: CloudinaryResource) => {
      setSelectedImage(image.secure_url);
      onSelect(image.secure_url);
      onOpenChange(false);
    },
    [onSelect, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pilih Gambar dari Galeri</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Tidak ada gambar di galeri
            </div>
          ) : (
            images.map((image) => (
              <div
                key={image.public_id}
                className={cn(
                  "group relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200",
                  selectedImage === image.secure_url
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handleSelect(image)}
              >
                <Image
                  src={image.secure_url}
                  alt={image.public_id.split("/").pop() || "Gallery image"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
