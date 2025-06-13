import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { products } from "./products";

export default function Products() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 p-4">
      <h1 className="text-4xl mb-8 mt-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <Link href={`/products/${product.slug}`} key={index}>
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
  );
}
