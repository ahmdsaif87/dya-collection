"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Wijaya",
    role: "Ibu Rumah Tangga",
    content:
      "Produk berkualitas tinggi dan pelayanan yang sangat memuaskan. Pengiriman cepat dan aman.",
    rating: 5,
    image:
      "https://res.cloudinary.com/dxurnpbrc/image/upload/v1749975126/jsgyg2webfdidlwrhdsw.webp",
  },
  {
    name: "Andi Pratama",
    role: "Ayah Muda",
    content:
      "Sangat puas dengan kualitas produk dan harga yang terjangkau. Anak saya sangat suka.",
    rating: 5,
    image:
      "https://res.cloudinary.com/dxurnpbrc/image/upload/v1749975126/jsgyg2webfdidlwrhdsw.webp",
  },
  {
    name: "Linda Kusuma",
    role: "Pengusaha",
    content:
      "Koleksi produk yang lengkap dan update. Recommended untuk para orang tua.",
    rating: 5,
    image:
      "https://res.cloudinary.com/dxurnpbrc/image/upload/v1749975126/jsgyg2webfdidlwrhdsw.webp",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Testimonials() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {testimonials.map((testimonial, index) => (
        <motion.div key={index} variants={item}>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {testimonial.content}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
