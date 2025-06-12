import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from 'next/link'

type ProductType = {
    name: string,
    desc: string,
    price: number,
    images: string
}

export default function Products() {
    const products: ProductType[] = [
        {
            name: "Tas 1",
            desc: "Simple dan elegan",
            price: 123,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 2",
            desc: "Nyaman digunakan",
            price: 456,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 3",
            desc: "Sehari-hari praktis",
            price: 789,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 4",
            desc: "Tahan lama",
            price: 321,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 5",
            desc: "Ekonomis multifungsi",
            price: 654,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 6",
            desc: "Modern dan praktis",
            price: 987,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 7",
            desc: "Ringan dan simpel",
            price: 159,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 8",
            desc: "Nyaman maksimal",
            price: 753,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 9",
            desc: "Minimalis elegan",
            price: 852,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 10",
            desc: "Ramah lingkungan",
            price: 951,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 11",
            desc: "Simple dan elegan",
            price: 123,
            images: "tas_product.jpg"
        },
        {
            name: "Tas 12",
            desc: "Nyaman digunakan",
            price: 456,
            images: "tas_product.jpg"
        },
    ];

    return (
        <div className="flex items-center justify-center flex-col gap-4 p-4">
            <h1 className="text-4xl mb-8 mt-6">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, index) => (
                    <Card key={product.name} className="w-60 gap-2 relative inline-block">
                        <CardHeader>
                            <Image src={`/${product.images}`} width={200} height={200} alt={String(product.name)}
                            className="transition-transform duration-300 hover:scale-105 rounded-lg" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>{product.desc}</CardDescription>
                            <CardAction>Rp.{product.price}</CardAction>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

    );
}