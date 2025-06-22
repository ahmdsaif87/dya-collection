import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const images = [
  "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/dog-sweater-1_wotfkk.png",
  "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/baby-onesie-beige-1_tojjri.png",
  "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
  "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-1_bhbzsp.png",
  "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-spiral-1_kz6pte.png",
  "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/shoes-1_zwm8do.png",
  "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-color-black_hvcfme.png",
];

const categories = [
  { name: "Tas Wanita" },
  { name: "Pakaian Anak" },
  { name: "Pakaian Dewasa" },
  { name: "Sepatu & Sandal" },
  { name: "Aksesoris" },
];

const getRandomImage = () => {
  return images[Math.floor(Math.random() * images.length)];
};

const getRandomPrice = () => {
  return Math.floor(Math.random() * (300000 - 50000) + 50000); // IDR 50k - 300k
};

const getRandomStock = () => {
  return Math.floor(Math.random() * 50) + 1;
};

async function main() {
  // Delete existing data
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("🗑️ Deleted existing data");

  // Create categories
  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
      },
    });

    console.log(`📦 Created category: ${category.name}`);

    // Create 10 products for each category
    for (let i = 1; i <= 10; i++) {
      const productName = `${category.name} ${i}`;
      const product = await prisma.product.create({
        data: {
          name: productName,
          description: `Deskripsi lengkap untuk ${productName}. Produk berkualitas tinggi pilihan Dya Collection.`,
          price: getRandomPrice(),
          imageUrl: getRandomImage(),
          categoryId: createdCategory.id,
          variant: {
            create: [
              {
                name: "Small",
                stock: getRandomStock(),
              },
              {
                name: "Medium",
                stock: getRandomStock(),
              },
              {
                name: "Large",
                stock: getRandomStock(),
              },
              ...(Math.random() > 0.5
                ? [
                    {
                      name: "Extra Large",
                      stock: getRandomStock(),
                    },
                  ]
                : []),
            ],
          },
        },
      });

      console.log(`📝 Created product: ${productName}`);
    }
  }

  console.log("✅ Seed data created successfully for Dya Collection");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
