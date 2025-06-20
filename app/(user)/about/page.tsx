import { CheckCircle, Users, Truck, Shield, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimatedSection from "@/components/animated-section";

export default function AboutPage() {
  return (
    <AnimatedSection delay={0.3}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className=" py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tentang Kami
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your trusted online marketplace connecting millions of customers
              with quality products since 2020
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2020, ShopHub began as a small startup with a big
                  vision: to create an online marketplace that puts customers
                  first. What started as a team of five passionate individuals
                  has grown into a thriving platform serving millions of
                  customers worldwide.
                </p>
                <p className="text-gray-600 mb-4">
                  We believe that shopping online should be simple, secure, and
                  enjoyable. That's why we've built our platform with
                  cutting-edge technology and a customer-centric approach that
                  ensures every interaction is smooth and satisfying.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to partner with thousands of sellers and
                  brands to bring you the best products at competitive prices,
                  backed by exceptional customer service.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      5M+
                    </div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      50K+
                    </div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      1K+
                    </div>
                    <div className="text-sm text-gray-600">Trusted Sellers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      99.9%
                    </div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do and shape the
                experience we create for our customers
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                <p className="text-gray-600">
                  We carefully curate our product selection to ensure every item
                  meets our high standards for quality and value.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Love</h3>
                <p className="text-gray-600">
                  Our customers are at the heart of everything we do. We're
                  committed to providing exceptional service and support.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust & Security</h3>
                <p className="text-gray-600">
                  We use advanced security measures to protect your data and
                  ensure safe, secure transactions every time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose ShopHub?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're more than just an online store - we're your trusted
                shopping partner
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Fast Shipping</h3>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $50 with delivery in 2-3 business
                  days
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  Your payment information is protected with bank-level security
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-sm text-gray-600">
                  30-day money-back guarantee on all purchases
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">
                  Round-the-clock customer service to help you anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tim Kami</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The passionate people behind ShopHub who work tirelessly to
                bring you the best shopping experience
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary  border rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                <p className="text-primary mb-2">CEO & Founder</p>
                <p className="text-sm text-gray-600">
                  Visionary leader with 15+ years in e-commerce, passionate
                  about creating exceptional customer experiences.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-primary text-primary-foreground border rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
                <p className="text-primary mb-2">CTO</p>
                <p className="text-sm text-gray-600">
                  Tech innovator ensuring our platform stays cutting-edge and
                  secure for millions of users worldwide.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-primary text-primary-foreground border rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emily Rodriguez</h3>
                <p className="text-primary mb-2">Head of Customer Success</p>
                <p className="text-sm text-gray-600">
                  Dedicated to ensuring every customer has an amazing experience
                  from browse to delivery and beyond.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 mx-5 rounded-t-4xl bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join millions of satisfied customers and discover amazing products
              at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">Browse Products</Link>
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
