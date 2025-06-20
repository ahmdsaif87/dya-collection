"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/animated-section";

export default function ContactPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <AnimatedSection delay={0.3}>
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Hubungi Kami</h1>
          <p className="text-muted-foreground">
            Ada pertanyaan? Kami siap membantu Anda
          </p>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a
            href="tel:+6281234567890"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
          >
            <Phone className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <p className="font-medium">Telepon</p>
              <p className="text-muted-foreground">0812-3456-7890</p>
            </div>
          </a>

          <a
            href="mailto:hello@dyaofficial.com"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
          >
            <Mail className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <p className="font-medium">Email</p>
              <p className="text-muted-foreground">hello@dyaofficial.com</p>
            </div>
          </a>

          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <p className="font-medium">WhatsApp</p>
              <p className="text-muted-foreground">Chat Langsung</p>
            </div>
          </a>
        </div>

        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
          <Input placeholder="Nama Lengkap" required />
          <Input type="email" placeholder="Email" required />
          <Textarea
            placeholder="Pesan Anda"
            className="min-h-[120px]"
            required
          />
          <Button type="submit" className="w-full">
            Kirim Pesan
          </Button>
        </form>
      </div>
    </AnimatedSection>
  );
}
