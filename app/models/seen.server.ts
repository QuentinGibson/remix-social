import type { Post } from "@prisma/client";
import type { User } from "@prisma/client";
import { prisma } from "~/db.server";
export async function getSeen(userId: User["id"], postId: Post["id"]) {
  const seen = await prisma.seen.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  return seen ? true : false;
}

export async function createSeen(userId: User["id"], postId: Post["id"]) {
  try {
    const seen = { userId, postId };
    return await prisma.seen.upsert({
      where: {},
      create: seen,
      update: {},
    });
  } catch (error: any) {
    return { error: error.message };
  }
}
