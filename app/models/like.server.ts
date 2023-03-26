import { prisma } from "~/db.server";
export async function createLike(userId: string, postId: string) {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });
  if (!existingLike) {
    return await prisma.like
      .create({
        data: {
          user: { connect: { id: userId } },
          post: { connect: { id: postId } },
        },
      })
      .then((res) => {
        return {
          ok: true,
          message: `${userId} successfully liked the post ${postId}`,
        };
      })
      .catch((error) => {
        return { ok: false, message: error };
      });
  }
}

export async function removeLike(userId: string, postId: string) {
  return await prisma.like.delete({
    where: {
      userId_postId: { userId, postId },
    },
  });
}

export async function getLikes(postId: string) {
  return await prisma.like.findMany({
    where: { user: { id: postId } },
  });
}
