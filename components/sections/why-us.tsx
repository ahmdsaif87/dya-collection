"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Kualitas Terjamin",
    description:
      "Produk terbaik dengan standar kualitas tinggi untuk buah hati Anda",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Layanan pengiriman cepat ke seluruh Indonesia",
  },
  {
    icon: HeartHandshake,
    title: "Pelayanan Terbaik",
    description: "Dukungan pelanggan 24/7 untuk membantu Anda",
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

export function WhyUs() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={item}
          className="flex flex-col items-center text-center p-6"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="mb-4"
          >
            <feature.icon size={40} className="text-primary" />
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
