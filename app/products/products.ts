type ProductType = {
  name: string;
  slug: string;
  desc: string;
  price: number;
  stock: number;
  images: string;
  detail?: string[];
  variant?: string[];
  weight?: number;
};

export const products: ProductType[] = [
  {
    name: "Tas Ransel Kulit Pria",
    slug: "tas-ransel-kulit-pria",
    desc: "Tas ransel berbahan kulit asli, cocok untuk aktivitas sehari-hari.",
    price: 450000,
    stock: 10,
    images: "tas_product.jpg",
    detail: [
      "Kulit asli",
      "Lapisan dalam lembut",
      "Kompartemen laptop 15 inci",
    ],
    variant: ["Coklat", "Hitam"],
    weight: 1200,
  },
  {
    name: "Tas Slempang Casual",
    slug: "tas-slempang-casual",
    desc: "Tas selempang ringan dan nyaman dipakai jalan-jalan.",
    price: 200000,
    stock: 15,
    images: "tas_product.jpg",
    detail: ["Anti air", "Tali panjang adjustable", "Ukuran compact"],
    variant: ["Abu-abu", "Navy"],
    weight: 600,
  },
  {
    name: "Backpack Travel Besar",
    slug: "backpack-travel-besar",
    desc: "Tas besar untuk perjalanan jauh, banyak ruang penyimpanan.",
    price: 550000,
    stock: 7,
    images: "tas_product.jpg",
    detail: ["35L kapasitas", "Tahan hujan ringan", "Slot USB charger"],
    variant: ["Hitam", "Hijau army"],
    weight: 1800,
  },
  {
    name: "Tas Kerja Formal",
    slug: "tas-kerja-formal",
    desc: "Tas kerja elegan untuk ke kantor dan meeting formal.",
    price: 380000,
    stock: 8,
    images: "tas_product.jpg",
    detail: ["Kompartemen laptop", "Desain minimalis", "Handle kulit"],
    variant: ["Hitam", "Coklat tua"],
    weight: 900,
  },
  {
    name: "Tas Tote Wanita",
    slug: "tas-tote-wanita",
    desc: "Tas tote stylish dan luas, cocok untuk kuliah dan kerja.",
    price: 320000,
    stock: 12,
    images: "tas_product.jpg",
    detail: ["Muatan banyak", "Zipper kuat", "Bahan kanvas premium"],
    variant: ["Krem", "Maroon", "Hitam"],
    weight: 800,
  },
  {
    name: "Tas Kamera Anti Air",
    slug: "tas-kamera-anti-air",
    desc: "Tas khusus kamera dengan lapisan pelindung dan anti air.",
    price: 480000,
    stock: 6,
    images: "tas_product.jpg",
    detail: ["Slot kamera dan lensa", "Tali tebal", "Rain cover included"],
    variant: ["Hitam", "Abu gelap"],
    weight: 1500,
  },
  {
    name: "Tas Pinggang Sporty",
    slug: "tas-pinggang-sporty",
    desc: "Tas pinggang praktis untuk lari dan aktivitas outdoor.",
    price: 150000,
    stock: 20,
    images: "tas_product.jpg",
    detail: ["Ringan", "Kompartemen botol minum", "Reflektor malam"],
    variant: ["Merah", "Biru", "Hitam"],
    weight: 400,
  },
  {
    name: "Tas Laptop Kulit",
    slug: "tas-laptop-kulit",
    desc: "Tas laptop dengan bahan kulit premium dan desain eksklusif.",
    price: 520000,
    stock: 5,
    images: "tas_product.jpg",
    detail: ["Slot laptop 14 inci", "Bahan kulit sapi", "Ritsleting metal"],
    variant: ["Coklat tua", "Hitam"],
    weight: 1100,
  },
  {
    name: "Tas Punggung Anak",
    slug: "tas-punggung-anak",
    desc: "Tas lucu dan ringan, cocok untuk anak sekolah TK/SD.",
    price: 175000,
    stock: 18,
    images: "tas_product.jpg",
    detail: ["Desain karakter", "Tali empuk", "Ringan"],
    variant: ["Pink", "Biru", "Hijau"],
    weight: 500,
  },
  {
    name: "Tas Duffle Gym",
    slug: "tas-duffle-gym",
    desc: "Tas duffle besar untuk olahraga dan perjalanan pendek.",
    price: 270000,
    stock: 9,
    images: "tas_product.jpg",
    detail: ["Kompartemen sepatu", "Strap bahu adjustable", "Resleting YKK"],
    variant: ["Hitam", "Merah marun"],
    weight: 1300,
  },
  {
    name: "Tas Bahu Fashion Wanita",
    slug: "tas-bahu-fashion-wanita",
    desc: "Tas bahu modis untuk hangout dan acara semi formal.",
    price: 295000,
    stock: 14,
    images: "tas_product.jpg",
    detail: ["Bahan kulit sintetis", "Strap panjang", "Interior berlapis"],
    variant: ["Putih", "Pink", "Coklat"],
    weight: 700,
  },
  {
    name: "Tas Outdoor Hiking",
    slug: "tas-outdoor-hiking",
    desc: "Tas kuat untuk hiking, dengan banyak saku dan tali pengikat.",
    price: 600000,
    stock: 4,
    images: "tas_product.jpg",
    detail: ["Kapasitas 40L", "Raincover", "Slot botol dan trekking pole"],
    variant: ["Hijau army", "Abu-abu"],
    weight: 1900,
  },
];
