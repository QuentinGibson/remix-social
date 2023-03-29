import type { Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

const items = 10;
export async function getPosts(page: number) {
  const posts = await prisma.post.findMany({
    skip: (page - 1) * items,
    take: items,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      likes: true,
      user: true,
      comments: true,
    },
  });
  const count = await prisma.post.count();

  return { posts, page, count };
}

export async function getUserFeed(userId: string, page: number) {
  const blockedPosts = await prisma.blockedPost.findMany({
    where: {
      userId: userId,
    },
    select: {
      postId: true,
    },
  });
  const blockedPostIds = blockedPosts.map((blockedPost) => blockedPost.postId);

  const posts = await prisma.post.findMany({
    skip: (page - 1) * items,
    take: items,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      NOT: {
        id: { in: blockedPostIds },
      },
    },
    include: {
      likes: true,
      user: true,
      comments: true,
    },
  });
  const count = await prisma.post.count();

  return { posts, page, count };
}

export async function getCount() {
  return await prisma.post.count();
}

export async function createPost({
  title,
  image,
  userId,
}: Pick<Post, "title" | "image"> & { userId: User["id"] }) {
  throw Error("No new post for you!");
  return await prisma.post.create({
    data: {
      title,
      image,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function getPost(id: Post["id"]) {
  return await prisma.post.findFirst({
    where: {
      id,
    },
    include: {
      comments: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes: true,
      user: true,
    },
  });
}

export async function deletePost({
  id,
  userId,
}: Pick<Post, "id"> & {
  userId: User["id"];
}) {
  return prisma.post.deleteMany({
    where: { id, userId },
  });
}
