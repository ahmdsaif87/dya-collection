import Image from "next/image";

<<<<<<< HEAD
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to DyahColection</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-lg">
              <h3 className="font-semibold mb-2 text-xl">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <h3 className="font-semibold mb-2 text-xl">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <h3 className="font-semibold mb-2 text-xl">Easy Returns</h3>
              <p className="text-gray-600">30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
=======
export default function HeroSection() {
  return (
    <section className="bg-pink-50 py-16 px-8 flex flex-col md:flex-row items-center justify-between">
      {/* Text Section */}
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
          Koleksi Tas Dya Official
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Temukan gaya terbaikmu dengan koleksi tas elegan & modern. Cocok untuk aktivitas harian maupun acara spesial.
        </p>
        <div className="flex space-x-4">
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition">
            Belanja Sekarang
          </button>
          <button className="border border-pink-500 text-pink-500 hover:bg-pink-100 font-semibold py-3 px-6 rounded-xl transition">
            Lihat Koleksi
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="mt-10 md:mt-0 md:ml-12">
        <Image
          src="/tas-wanita.jpg" // ganti dengan path gambar tas kamu
          alt="Tas Wanita Elegan"
          width={500}
          height={500}
          className="rounded-xl shadow-xl"
        />
      </div>
    </section>
  );
>>>>>>> 649ac21ff44ed0747c5e3f0b626ce159d29d1a85
}
