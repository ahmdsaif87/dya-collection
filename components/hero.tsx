"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-16 px-5 flex flex-col md:flex-row items-center justify-between w-full min-h-screen overflow-hidden bg-background text-foreground">
      {/* Decorative blurred blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-muted/20 rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Text Section */}
      <motion.div
        className="relative z-10 max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-2 mb-4 bg-muted px-4 py-2 rounded-full text-sm border border-border w-fit">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium text-muted-foreground">
            Produk Terbaik untuk Anda
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 tracking-tight">
          Koleksi <br />
          <span className="text-primary">Dya Official</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
          Temukan gaya terbaikmu dengan koleksi tas elegan & modern. Cocok untuk
          aktivitas harian maupun acara spesial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Belanja Sekarang
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg">
            Lihat Koleksi
          </Button>
        </div>

        {/* Trust badges */}
        <motion.div
          className="mt-10 flex items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-background border rounded-full shadow-sm">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">1000+</p>
              <p className="text-sm text-muted-foreground">Produk Terjual</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-background border rounded-full shadow-sm">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold">4.9/5</p>
              <p className="text-sm text-muted-foreground">Google Rating</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="relative mt-10 md:mt-0 md:ml-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-primary/10 rounded-xl blur-2xl -rotate-6 scale-105" />
        <Image
          src="https://res.cloudinary.com/dxurnpbrc/image/upload/v1750148957/baby-cap-black_t5zzrr.png"
          alt="Tas Wanita Elegan"
          width={500}
          height={500}
          className="relative transition-transform hover:scale-105 duration-500"
          priority
        />

        <motion.div
          className="absolute right-10 bottom-20 bg-background border px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-sm font-medium text-muted-foreground">
            Premium Quality
          </span>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
