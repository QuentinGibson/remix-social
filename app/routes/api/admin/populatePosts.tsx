import { DataFunctionArgs, redirect } from "@remix-run/node";
import { faker } from "@faker-js/faker";
import { createPost } from "~/models/post.server";
import { requireUser } from "~/session.server";

/**
 * Generates 30 fake posts with random titles and images for the current user.
 * If the current user is not an admin, redirects to the login page.
 *
 * @async
 * @function
 * @param {DataFunctionArgs} args - The arguments for the data function, including the request object.
 * @returns {Promise<{ redirect: string, status: number }>} - A redirect object if the user is not an admin, or void if the posts were created successfully.
 */
export const action = async ({ request }: DataFunctionArgs) => {
  const user = await requireUser(request);
  if (!user.isAdmin) {
    return redirect("/login");
  }
  for (let i = 0; i < 30; i++) {
    const title = faker.lorem.sentence();
    const image = faker.image.imageUrl();

    await createPost({ title, image, userId: user.id });
  }
  return redirect("/login");
};
