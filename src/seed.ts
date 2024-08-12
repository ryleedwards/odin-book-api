import { PrismaClient, Prisma } from '@prisma/client';
import { seedData } from './seedData';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

const prisma = new PrismaClient();

const comments = [
  'Great post!',
  'Really insightful.',
  'I totally agree with you.',
  'Well written!',
  'Thank you for sharing this.',
  'Interesting perspective.',
  'I learned something new today.',
  'This is awesome!',
  'Keep up the great work!',
  'Loved reading this!',
];

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
          await prisma.follow.upsert({
            where: {
              followerId_followingId: {
                followerId: follower.id,
                followingId: following.id,
              },
            },
            update: {},
            create: {
              follower: { connect: { id: follower.id } },
              following: { connect: { id: following.id } },
            },
          });
        }
      }
    }
  }

  // Add likes to posts
  const allUsers = await prisma.user.findMany();
  const allPosts = await prisma.post.findMany();

  for (const post of allPosts) {
    const usersToLike = _.sampleSize(allUsers, _.random(0, 5));

    for (const user of usersToLike) {
      await prisma.like.upsert({
        where: {
          userId_postId: {
            userId: user.id,
            postId: post.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          postId: post.id,
        },
      });
    }
  }

  // Add comments to posts

  for (const post of allPosts) {
    const numberOfComments = _.random(0, 4);
    const selectedComments = _.sampleSize(comments, numberOfComments);

    for (const commentText of selectedComments) {
      const randomUser = _.sample(allUsers);
      if (randomUser) {
        await prisma.comment.create({
          data: {
            content: commentText,
            post: { connect: { id: post.id } },
            author: { connect: { id: randomUser.id } },
          },
        });
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
