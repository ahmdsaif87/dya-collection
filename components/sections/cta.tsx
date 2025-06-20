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
        Temukan Produk Terbaik untuk Si Kecil
      </h2>
      <p className="text-muted-foreground mb-8">
        Koleksi lengkap produk berkualitas dengan harga terjangkau untuk buah
        hati tercinta
      </p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Link href="/search">
          <Button size="lg" className="gap-2">
            Belanja Sekarang
            <ArrowRight size={16} />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
