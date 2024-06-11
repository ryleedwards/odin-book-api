import { PrismaClient, Prisma } from '@prisma/client';
import { seedData } from './seedData';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const created: Object[] = [];
  seedData.forEach(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        posts: {
          create: user.posts,
        },
        profile: {
          create: user.profile,
        },
      },
    });
    created.push(createdUser);
  });
  console.log(created);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
