import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      name: "Kickback-User",
    },
  });
  const createPost = (id: string) => {
    // Set up parameters for LoremPixel API
    const categories = [
      "abstract",
      "animals",
      "nature",
      "business",
      "cats",
      "food",
      "nightlife",
      "sports",
      "fashion",
    ];
    const numImages = 100;
    const randomMax = 1000;
    const randomIndex = Math.floor(Math.random() * numImages);
    const randomCategory = Math.floor(Math.random() * categories.length);

    // Generate array of random image URLs using LoremPixel API
    const imageUrls = [];

    for (let i = 0; i < numImages; i++) {
      const randomNum = Math.floor(Math.random() * randomMax);
      const category = categories[randomCategory];
      const width = 800;
      const height = 600;

      const url = `https://picsum.photos/${width}/${height}?random=${randomNum}&category=${category}`;
      imageUrls.push(url);
    }
    faker.seed();
    const title = faker.lorem.words();

    let post = {
      title,
      image: imageUrls[randomIndex],
      userId: user.id,
    };

    return prisma.post.upsert({
      where: { id },
      update: post,
      create: post,
    });
  };
  for (let i = 0; i < 100; i++) {
    await createPost(i.toString());
  }
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
