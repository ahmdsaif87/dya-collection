import dynamic from "next/dynamic";
import Hero from "@/components/hero";
import { WhyUs } from "@/components/sections/why-us";
import { CTA } from "@/components/sections/cta";
import ProductCategory from "@/components/product-category";
import AnimatedSection from "@/components/animated-section";
import MapEmbed from "@/components/MapEmbed";

// Dynamically import heavier components
const ProductList = dynamic(
  () => import("@/components/product-list").then((mod) => mod.ProductList),
  {
    loading: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-60 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    ),
  }
);

const Testimonials = dynamic(
  () =>
    import("@/components/sections/testimonials").then(
      (mod) => mod.Testimonials
    ),
  {
    loading: () => (
      <div className="h-60 rounded-xl bg-gray-100 animate-pulse" />
    ),
  }
);

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 space-y-32 py-20">
        {/* Featured Categories */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-col items-center gap-6 mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.1]">
              Kategori Unggulan
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-medium max-w-2xl">
              Temukan koleksi produk premium yang dirancang khusus untuk
              memberikan yang terbaik bagi Si Kecil tercinta
            </p>
          </div>
          <ProductCategory />
        </AnimatedSection>

        {/* Featured Products */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-col items-center gap-6 mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.1]">
              Produk Unggulan
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-medium max-w-2xl">
              Pilihan terbaik yang telah dipercaya ribuan keluarga untuk
              kualitas dan keamanan terjamin
            </p>
          </div>
          <ProductList />
        </AnimatedSection>

        {/* Why Choose Us */}
        <AnimatedSection className="bg-muted/30 -mx-4 px-4 py-20 md:py-24">
          <div className="container mx-auto">
            <div className="flex flex-col items-center gap-6 mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.1]">
                Mengapa Memilih Kami
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-medium max-w-2xl">
                Dedikasi mendalam untuk menghadirkan pengalaman berbelanja
                terbaik dengan standar kualitas tertinggi
              </p>
            </div>
            <WhyUs />
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-col items-center gap-6 mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.1]">
              Apa Kata Mereka
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-medium max-w-2xl">
              Cerita inspiratif dari keluarga yang telah merasakan manfaat luar
              biasa dari produk berkualitas kami
            </p>
          </div>
          <Testimonials />
        </AnimatedSection>

        <AnimatedSection>
          <div className="container mx-auto flex flex-col items-center gap-6 mb-16 text-center max-w-3xl ">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.1]">
              JIMS HONEY by Dya Official
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-medium max-w-2xl">
              Jl. Raya Cikarang, No. 123, Kota Cikarang, Jawa Barat
            </p>
            <MapEmbed />
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection
          delay={0.3}
          className="bg-muted/30 -mx-4 px-4 py-20 md:py-24"
        >
          <div className="container mx-auto">
            <CTA />
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
