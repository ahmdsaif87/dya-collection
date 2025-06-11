import Image from "next/image";

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
}
