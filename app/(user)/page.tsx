import Image from "next/image";
import Products from "./products/page";
import Hero from "@/components/hero";
import ProductCategory from "@/components/product-category";

export default function HeroSection() {
  return (
    <>
    <section>
      <Hero />
    </section>
      <section>
        <Products />
      </section>
    </>
  );
}
