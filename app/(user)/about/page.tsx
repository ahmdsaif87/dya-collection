import { CheckCircle, Users, Truck, Shield, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimatedSection from "@/components/animated-section";

export default function AboutPage() {
  return (
    <AnimatedSection delay={0.3}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className=" py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-medium mb-2">
              About Dya
            </h1>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-2">
          <div className="container mx-auto px-4">
            <div className="flex text-justify max-w-3xl mx-auto mb-8">
              <div>
                <p className="text-foreground mb-4">
                  Didirikan pada tahun 2020, Dya Collection berawal dari toko kecil dengan visi besar: menghadirkan produk fashion yang terjangkau dan berkualitas untuk semua kalangan. Dari awalnya hanya dijalankan oleh tim kecil yang penuh semangat, kini Dya Collection telah berkembang menjadi brand yang dipercaya oleh ribuan pelanggan di seluruh Indonesia.
                </p>
                <p className="text-foreground mb-4">
                  Kami percaya bahwa belanja online haruslah mudah, aman, dan menyenangkan. Karena itu, kami terus berinovasi dalam menghadirkan platform yang ramah pengguna, didukung oleh teknologi yang andal dan pelayanan pelanggan yang responsif.
                </p>
                <p className="text-foreground">
                  Saat ini, Dya Collection bangga menawarkan beragam pilihan tas, jam tangan, dan daster berkualitas, dengan harga kompetitif dan layanan yang mengutamakan kepuasan pelanggan.
                </p>

              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-5 rounded-t-4xl">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-medium mb-4">
              Apakah Anda Siap untuk Berbelanja?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/search">Browse Products</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-primary border-white hover:bg-white"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </AnimatedSection>
  );
}
