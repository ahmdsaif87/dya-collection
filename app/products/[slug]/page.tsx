"use client";

import { useParams } from "next/navigation";
import { products } from "../products";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [selectedVariant, setSelectedVariant] = useState(product?.variant?.[1]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="flex w-full max-w-7xl gap-x-8 border p-7 bg-card">
        {/* Product Image */}
        <div className="w-1/2">
          <div className="aspect-square overflow-hidden ">
            <Image
              src={`/${product.images}`}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-1/2 flex flex-col">
          <h1 className="text-7xl font-medium ">
            <span className="block">{product.name.split(" ")[0]}</span>
            <span className="block">
              {product.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <Badge className="font-mono text-xl font-bold mt-4 rounded-full border-primary border-2 ">
            Rp. {product.price.toLocaleString("id-ID")}
          </Badge>

          <Separator className="my-4" />
          {/* Color Selection */}
          {product.variant && (
            <div>
              <h3 className="text-sm font-medium">VARIAN</h3>
              <div className="mt-2 flex gap-2">
                {product.variant.map((variant) => (
                  <Button
                    variant={"outline"}
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "rounded-full px-4 py-1 ",
                      selectedVariant === variant && " border-3 border-primary"
                    )}
                  >
                    {variant}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {product.desc && (
            <p className="text-md text-muted-foreground mt-4">{product.desc}</p>
          )}

          {/* Product Features */}
          {product.detail && (
            <div className="mt-4">
              <ul className="list-disc space-y-2 pl-5">
                {product.detail.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            className="p-10 rounded-full w-full mt-8"
            size="lg"
            variant={"outline"}
          >
            <Plus />
            Add To Cart
          </Button>
        </div>
      </div>
      <div className="w-full max-w-7xl mt-10">
        <h2 className="text-2xl font-medium justify-start">
          Produk yang mungkin anda sukai
        </h2>
        <div className="flex gap-4 mt-4 overflow-x-auto pb-10">
          {products.slice(0, 10).map((product) => (
            <Link href={`/products/${product.slug}`} key={product.slug}>
              <Card
                key={product.name}
                className="w-60 gap-2 relative inline-block"
              >
                <CardHeader>
                  <Image
                    src={`/${product.images}`}
                    width={200}
                    height={200}
                    alt={String(product.name)}
                    className="transition-transform duration-300 hover:scale-105 rounded-lg"
                  />
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.desc}
                  </CardDescription>
                  <CardAction>Rp.{product.price}</CardAction>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
