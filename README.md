<Image
  src="https://res.cloudinary.com/dxurnpbrc/image/upload/v1752689358/2_uzufdg.png"
  alt="Dya Collection E-commerce Platform"
  width={1200}
  height={630}
  className="rounded-lg"
/>

# Dya Collection - Fashion E-commerce Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ahmdsaif87/dya-collection)

Dya Collection is a website-based e-commerce platform developed as part of a Community Service Project (Pengabdian Pada Masyarakat) to support the digital transformation of a local MSME, 'Toko Koleksi Tas DYA'. The primary goal was to elevate the business from conventional sales methods, which relied on social media and direct communication, to a structured and professional online presence. This project provides a comprehensive solution to expand market reach, manage product and transaction data effectively, and strengthen the brand's image in the digital marketplace.

## Fitur Utama

The platform is divided into two main parts: the customer-facing storefront and the admin dashboard.

### Fitur untuk Pelanggan

![Customer View - Product Page](https://res.cloudinary.com/dxurnpbrc/image/upload/v1752689359/4_vm2eef.png)

- **Autentikasi Aman**: Secure user registration and login handled by Clerk, including social sign-on options.
- **Katalog Produk Interaktif**: Browse products with ease, filter by category, and use a command palette (⌘K) for quick navigation.
- **Halaman Detail Produk**: View product details, select from available variants (e.g., color), check stock, and view high-quality images.
- **Keranjang Belanja Dinamis**: Add products to the cart, update quantities, and see the total price update in real-time.
- **Proses Checkout Mulus**: A streamlined, multi-step checkout process to place orders efficiently.
- **Manajemen Alamat**: Users can save and manage multiple shipping addresses for faster checkouts.
- **Riwayat Pesanan**: Access a personal dashboard to track current and past orders with statuses like `Pending`, `Paid`, `Shipped`, and `Completed`.

### Fitur Dasbor Admin

![Admin View - Dashboard](https://res.cloudinary.com/dxurnpbrc/image/upload/v1752689359/4_vm2eef.png)

- **Dashboard Analitik**: An overview of key metrics, including sales charts, recent orders, and revenue summaries, powered by Recharts.
- **Manajemen Produk (CRUD)**: Easily create, read, update, and delete products.
- **Varian & Stok**: Add multiple variants (e.g., color, size) to each product with independent stock management for each variant.
- **Manajemen Kategori**: Organize products by creating and managing categories.
- **Manajemen Pesanan**: View a list of all customer orders, inspect order details, and update order statuses.
- **Integrasi Cloudinary**: Seamlessly upload product images via a dedicated widget or select from a pre-existing gallery in Cloudinary.
- **Tabel Data Interaktif**: All management tables (products, orders, etc.) are built with TanStack Table, featuring sorting, filtering, and pagination.

## Teknologi yang Digunakan

- **Framework**: Next.js 15
- **Bahasa**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Autentikasi**: Clerk
- **Manajemen Media**: Cloudinary
- **Styling**: Tailwind CSS & shadcn/ui
- **Manajemen State**: Zustand & TanStack Query
- **Formulir**: React Hook Form & Zod
- **Tabel**: TanStack Table

## Cara Memulai

### 1. Kloning Repositori

```bash
git clone https://github.com/ahmdsaif87/dya-collection
cd dya-collection
npm install
```

### 2. Setup Environment Variables

Salin `.env.example` menjadi `.env` dan isi dengan kredensial Anda.

```env
# Prisma
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Migrasi Database

Jalankan migrasi Prisma untuk menyiapkan skema database Anda.

```bash
npx prisma migrate dev
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Proyek

```
dya-collection/
├── app/
│   ├── (admin)/          # Rute dan komponen khusus admin
│   │   └── admin/
│   ├── (auth)/           # Rute autentikasi (sign-in, sign-up)
│   ├── (user)/           # Rute untuk pengguna (halaman utama, produk, cart)
│   └── api/              # API endpoints untuk backend logic
├── components/           # Komponen UI yang dapat digunakan kembali
├── lib/                  # Fungsi utilitas, hooks, dan konfigurasi
├── prisma/               # Skema dan migrasi Prisma
└── public/               # Aset statis
```

## Tim Pengembang

Proyek ini adalah hasil kolaborasi dalam program Pengabdian kepada Masyarakat.

- **Wahyu Fadil** ([@fadilsflow](https://github.com/fadilsflow)) - Full Stack Developer
- **Ahmad Saif** ([@ahmdsaif87](https://github.com/ahmdsaif87)) - Backend Developer
- **Dede Fernanda** ([@ddfrnnd](https://github.com/ddfrnnd)) - Frontend Developer
- **Alifia Shasa** ([@Alifia-30](https://github.com/Alifia-30)) - UI/UX Designer

## Sumber Daya

- [Live Demo](https://dya-collection.vercel.app)
- [GitHub Repository](https://github.com/ahmdsaif87/dya-collection)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Clerk Documentation](https://clerk.com/docs)
