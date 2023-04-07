import {
  ActionFunction,
  DataFunctionArgs,
  json,
  LoaderArgs,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  redirect("/");
};

/**

Asynchronously creates a like for a post made by the current user.
@async
@function action
@param {Object} DataFunctionArgs - An object containing the request to be made.
@param {Object} DataFunctionArgs.request - The request to be made.
@returns {Promise<Object>} - A promise that resolves with an object containing the result of the like operation.
@throws {Error} - Throws an error if the user is not authorized to create the like or if an error occurs during the like operation.
*/
export const action = async ({ request }: DataFunctionArgs) => {
  const redirectURL = request.headers.get("Referer");
  const requestId = await requireUserId(request);
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const postId = formData.get("postId") as string;

  if (requestId !== userId) {
    throw Error("User rejected!");
  }
  invariant(typeof userId === "string", "userId must be a string");
  invariant(typeof postId === "string", "postId must be a string");

  invariant(redirectURL, "Must have a original url");
  try {
    await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });

    return json({ ok: true, intent: "like", message: "like sucessful" });
  } catch (e: any) {
    return json({ ok: false, intent: "like", message: e.message });
  }
};
