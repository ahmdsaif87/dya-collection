import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";

type ProductType = {
    name: string,
    desc: string,
    price: number,
    images: string
}

export default function Products() {
    const products: ProductType[] = [
        {
            name: "Product 1",
            desc: "asdadadada",
            price: 123,
            images: "product.jpeg"
        },
        {
            name: "Product 2",
            desc: "asdasdad",
            price: 456,
            images: "product.jpeg"
        },
        {
            name: "Product 3",
            desc: "Produk ini cocok untuk kebutuhan sehari-hari",
            price: 789,
            images: "product.jpeg"
        },
        {
            name: "Product 4",
            desc: "Kualitas terbaik dan tahan lama",
            price: 321,
            images: "product.jpeg"
        },
        {
            name: "Product 5",
            desc: "Produk ekonomis dan multifungsi",
            price: 654,
            images: "product.jpeg"
        },
        {
            name: "Product 6",
            desc: "Pilihan tepat untuk rumah tangga modern",
            price: 987,
            images: "product.jpeg"
        },
        {
            name: "Product 7",
            desc: "Ringan dan mudah digunakan",
            price: 159,
            images: "product.jpeg"
        },
        {
            name: "Product 8",
            desc: "Dirancang untuk kenyamanan maksimal",
            price: 753,
            images: "product.jpeg"
        },
        {
            name: "Product 9",
            desc: "Desain minimalis dan elegan",
            price: 852,
            images: "product.jpeg"
        },
        {
            name: "Product 10",
            desc: "Dibuat dari bahan ramah lingkungan",
            price: 951,
            images: "product.jpeg"
        },
        {
            name: "Product 11",
            desc: "asdadadada",
            price: 123,
            images: "product.jpeg"
        },
        {
            name: "Product 12",
            desc: "asdasdad",
            price: 456,
            images: "product.jpeg"
        },
    ];

    return (
        <div className="flex items-center justify-center flex-col gap-4 p-4">
            <h2>Our Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, index) => (
                    <Card key={product.name} className="w-60 gap-2">
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>{product.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-2">
                            <Image src={`/${product.images}`} width={200} height={200} alt={String(product.name)} />
                            <Button>{product.price}</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

    );
}