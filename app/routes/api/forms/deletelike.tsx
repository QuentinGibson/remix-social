import type {
  ActionFunction,
  DataFunctionArgs,
  LoaderArgs,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  redirect("/");
};

/**

Asynchronously deletes a like for a post made by the current user.
@async
@function action
@param {Object} DataFunctionArgs - An object containing the request to be made.
@param {Object} DataFunctionArgs.request - The request to be made.
@returns {Promise<Object>} - A promise that resolves with an object containing the result of the delete operation.
@throws {Error} - Throws an error if the user is not authorized to delete the like or if an error occurs during the delete operation.
*/
export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const redirectURL = request.headers.get("Referer");
    const formData = await request.formData();
    const { id } = await requireUser(request);
    const userId = formData.get("userId") as string;
    const postId = formData.get("postId") as string;

    if (id !== userId) {
      throw Error("User denied!");
    }
    invariant(redirectURL, "Must have a original url");
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return { ok: true, message: "successfully deleted like" };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
};
