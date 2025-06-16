import Image from "next/image";
import Products from "./products/page";
import Hero from "@/components/hero";

export default function HeroSection() {
  return (
    <>
      <Hero />

      <section>
        <Products />
      </section>
    </>
  );
}
