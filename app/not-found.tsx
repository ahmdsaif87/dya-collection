import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className=" text-xl ">404 | Halaman tidak ditemukan</h1>
        <Link href="/" className="underline">
          Kembali ke Halaman Utama
        </Link>
      </div>
      <Footer />
    </>
  );
}
