import { PrismaClient, Prisma } from '@prisma/client';
import { seedData } from './seedData';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const userPromises = seedData.map(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        posts: {
          create: user.posts || [],
        },
        profile: user.profile
          ? {
              create: user.profile,
            }
          : undefined,
      },
    });
    return createdUser;
  });

  const createdUsers = await Promise.all(userPromises);

  // Create follow relationships
  for (const user of seedData) {
    const follower = createdUsers.find((u) => u.email === user.email);
    if (follower) {
      for (const followEmail of user.follows || []) {
        const following = createdUsers.find((u) => u.email === followEmail);
        if (following) {
          await prisma.follow.create({
            data: {
              followerId: follower.id,
              followingId: following.id,
            },
          });
        }
      }
    }
  }
  console.log('Seeding completed.');
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
