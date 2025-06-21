"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import Link from "next/link";

const testimonials = [
  {
    name: "Ini Sonia",
    content:
      "Sukaaaa, pelayanannya bagus, tasnya juga bagusss, bakalan next order siii❤️⭐️⭐️⭐️⭐️⭐️",
    rating: 5,
    date: "4 bulan lalu",
    link: "https://maps.app.goo.gl/VJP9Jrc7ykGbXhtL9",
  },
  {
    name: "Winda Rizkiana",
    content:
      "Koleksi tas terlengkapp sih ini, cari model apa aja ada semua lengkap banget pokoknya, bahan nya juga premium banget, udah sering beli disini dan awet semua tas nya sampe sekarang, pokoknya sukses selalu buat koleksi tas dya semoga bisa buka cabang deket rumahku ya🥰 …",
    rating: 5,
    date: "2 tahun lalu",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjXMULqYxIPR1SetlpPQCFXwaqFutVV4SrQm6AksxmhybxYotCs=w72-h72-p-rp-mo-br100",
    link: "https://maps.app.goo.gl/ZEMoHeGZADkUUaK49",
  },
  {
    name: "Lely Maodhy",
    content:
      "Recomend bangt blnja sini udh selernya ramah, murah tapi bnrangnya gk murahan kwalitas good bangt, gk malu2 in deh",
    rating: 5,
    date: "8 bulan lalu",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjUfS8bl0XTzmEcA6_0fv_GZeVRcJTh0NoMeLwmbxaGceR8NBnl4=w72-h72-p-rp-mo-br100",
    link: "https://maps.app.goo.gl/5j5DBs8uAeV4xQnV6",
  },
  {
    name: "Dinda Olivia Putri",
    content:
      "Produknya bagus sesuai real pict, pelayanannya juga ramah,modelnya juga ga pasaran buruan yang mau beli sebelum kehabisan❤️😍",
    rating: 5,
    date: "10 bulan lalu",
    link: "https://maps.app.goo.gl/FsdmSFUgoqGqVuAKA",
  },
  {
    name: "Nita Utami",
    content:
      "Semua barang sudah pasti original ya say ... pelayanan jugaa mantap tentunya. Teteh owner jugaa enakan. Barang selalu update model terbaru. Cuzzs lah gausah ragu lngsng order d teteh uwi 😍🥰🥰🥰😘",
    rating: 5,
    date: "2 tahun lalu",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjVJ506ZiF8QaPSP8Tw1zGw7034IBAo2KVTa0rEeHcZ_fRTu_Bw=w72-h72-p-rp-mo-br100",
    link: "https://maps.app.goo.gl/zLwCnPQaxSMSU65EA",
  },
  {
    name: "Aulia Prima RP",
    content:
      "ownernya ramah pwoll, harganya juga terjangkauu dan kualitasnya jga bagus modelnya pun juga cantik2 bgt",
    rating: 5,
    date: "5 bulan lalu",
    link: "https://maps.app.goo.gl/c76BL5oa6HdDbkQx9",
  },
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

function ReviewCard({ review }: { review: (typeof testimonials)[0] }) {
  return (
    <Link href={review.link} target="_blank" rel="noopener noreferrer">
      <div
        className={cn(
          "relative h-full w-[300px] cursor-pointer overflow-hidden mx-2 transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-1",
          " bg-card hover:bg-card/50"
        )}
      >
        <div className="p-6 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              {review.image ? (
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  {review.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 absolute top-5 right-5">
              <a href={review.link} target="_blank" rel="noopener noreferrer">
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
              </a>
            </div>

            <div>
              <h4 className="font-semibold">{review.name}</h4>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {review.content}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function Testimonials() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <Marquee pauseOnHover className="[--duration:40s] mb-6">
        {firstRow.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:40s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
