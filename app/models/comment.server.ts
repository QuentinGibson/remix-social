import { prisma } from "~/db.server";

export async function createComment(
  userId: string,
  postId: string,
  body: string
) {
  const post = await prisma.post.findFirst({ where: { id: postId } });
  if (!post) {
    throw new Error("Post not found!");
  }
  return await prisma.comment.create({
    data: {
      postId,
      userId,
      body,
    },
  });
}
