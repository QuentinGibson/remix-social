import { prisma } from "~/db.server";

/**
 * Creates a new comment on a post with the given post ID and user ID, and the specified comment body.
 * Throws an error if the post with the given ID is not found.
 *
 * @async
 * @function
 * @param {string} userId - The ID of the user who wrote the comment.
 * @param {string} postId - The ID of the post on which the comment is being made.
 * @param {string} body - The body text of the comment.
 * @returns {Promise<Comment>} - A Promise that resolves to the newly created Comment object.
 * @throws {Error} - If the post with the given ID is not found.
 */
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
