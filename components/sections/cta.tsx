"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="text-center max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-semibold mb-4">
        Tas Wanita Stylish untuk Setiap Gaya
      </h2>
      <p className="text-muted-foreground mb-8">
        Temukan koleksi tas wanita terbaru dengan desain elegan, kualitas
        terbaik, dan harga terjangkau.
      </p>

      <Link href="/search">
        <Button
          size="lg"
          className="gap-2 hover:scale-105 transition-all duration-300"
        >
          Lihat Koleksi
          <ArrowRight size={16} />
        </Button>
      </Link>
    </motion.div>
  );
}
