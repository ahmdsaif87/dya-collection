import Image from "next/image";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="min-h-screen   py-16 px-5 flex flex-col md:flex-row items-center justify-center mx-auto w-full">
      {/* Text Section */}
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-7xl font-medium text-gray-800 leading-tight mb-4">
          Koleksi <br /> Dya Official
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-xl">
          Temukan gaya terbaikmu dengan koleksi tas elegan & modern. Cocok untuk
          aktivitas harian maupun acara spesial.
        </p>
        <div className="flex space-x-4">
          <Button variant="default" size={"lg"}>
            Belanja Sekarang
          </Button>
          <Button variant="outline" size={"lg"}>
            Lihat Koleksi
          </Button>
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
