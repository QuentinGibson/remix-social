import type { Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

/**
 * Retrieves a specified number of posts with associated likes, comments, and user data, sorted by creation date in descending order.
 * @param {number} page - The page number of the posts to retrieve.
 * @returns {Promise<Object>} An object containing an array of post objects and the total number of posts in the database.
 * @throws {Error} Throws an error if the database query fails.
 */
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

/**
 * Retrieves a paginated list of posts for a given user's feed, excluding any blocked posts.
 * @param {string} userId - The ID of the user whose feed is being retrieved.
 * @param {number} page - The page number to retrieve.
 * @returns {Promise<Object>} An object containing the posts, the current page number, and the total count of posts.
 */
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

/**
 * Retrieves the total count of posts in the database.
 * @returns {Promise<number>} The total count of posts in the database.
 */
export async function getCount() {
  return await prisma.post.count();
}

/**
 * Creates a new post in the database.
 *
 * @async
 * @param {Object} post - The post object containing the post title, image, and user ID.
 * @param {string} post.title - The title of the post.
 * @param {string} post.image - The URL of the post image.
 * @param {string} post.userId - The ID of the user creating the post.
 * @returns {Promise<Object>} The newly created post object containing the ID, title, image URL, creation date, and the user who created it.
 */
export async function createPost({
  title,
  image,
  userId,
}: Pick<Post, "title" | "image"> & { userId: User["id"] }) {
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

/**
 * Retrieves a post and its associated data by ID.
 * @param {string} id - The ID of the post to retrieve.
 * @returns {Promise<PostWithDetails>} A promise that resolves to the post object, including its comments, likes, and user information.
 * @throws {Error} Throws an error if the post cannot be found.
 */
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
              id: true,
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

/**

Deletes a post with the specified id that belongs to the specified user.
@async
@function deletePost
@param {Object} postDetails - An object containing the id of the post to delete and the id of the user who owns the post.
@param {string} postDetails.id - The id of the post to delete.
@param {string} postDetails.userId - The id of the user who owns the post.
@returns {Promise<number>} - The number of posts deleted.
@throws {Error} - If the post could not be deleted.
*/
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
