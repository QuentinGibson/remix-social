import { prisma } from "~/db.server";
/**
 * Creates a new like for a post.
 * @param {string} userId - The ID of the user who liked the post.
 * @param {string} postId - The ID of the post that was liked.
 * @returns {Promise<{ok: boolean, message: string}>} A Promise that resolves to an object with a boolean 'ok' property indicating success or failure and a 'message' property containing a success or error message.
 */
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

/**
 * Removes a like from the database with the given user ID and post ID.
 * @param {string} userId - The ID of the user who liked the post.
 * @param {string} postId - The ID of the post that was liked.
 * @returns {Promise<void>}
 */
export async function removeLike(userId: string, postId: string) {
  return await prisma.like.delete({
    where: {
      userId_postId: { userId, postId },
    },
  });
}

/**
 * Retrieves all likes associated with a given post.
 * @param {string} postId - The ID of the post to retrieve likes for.
 * @returns {Promise<Array<Object>>} - An array of like objects associated with the post, containing the ID of the user who liked the post and the ID of the post that was liked.
 */
export async function getLikes(postId: string) {
  return await prisma.like.findMany({
    where: { user: { id: postId } },
  });
}
