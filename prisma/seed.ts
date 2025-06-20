import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const images = [
  "https://res.cloudinary.com/dxurnpbrc/image/upload/v1750148957/baby-cap-black_t5zzrr.png",
  "https://res.cloudinary.com/dxurnpbrc/image/upload/v1750148957/hoodie-1_fakmha.png",
  "https://res.cloudinary.com/dxurnpbrc/image/upload/v1750148956/t-shirt-2_1_uiyrid.png",
  "https://res.cloudinary.com/dxurnpbrc/image/upload/v1750148956/hat-1_nr35tp.png",
];

const categories = [
  { name: "Pakaian Anak" },
  { name: "Aksesoris Bayi" },
  { name: "Perlengkapan Mandi" },
  { name: "Mainan Edukasi" },
  { name: "Peralatan Makan" },
];

const getRandomImage = () => {
  return images[Math.floor(Math.random() * images.length)];
};

const getRandomPrice = () => {
  return Math.floor(Math.random() * (300000 - 50000) + 50000);
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
          description: `Deskripsi lengkap untuk ${productName}. Produk berkualitas tinggi untuk buah hati Anda.`,
          price: getRandomPrice(),
          imageUrl: getRandomImage(),
          categoryId: createdCategory.id,
          // Create 2-4 variants for each product
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

  console.log("✅ Seed data created successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
