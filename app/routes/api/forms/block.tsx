import type { DataFunctionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  redirect("/");
};
/**

Asynchronously blocks a post for the current user.
@async
@function action
@param {Object} DataFunctionArgs - An object containing the request to be made.
@param {Object} DataFunctionArgs.request - The request to be made.
@returns {Promise<Object>} - A promise that resolves with an object containing the result of the blocking operation.
@throws {Error} - Throws an error if an error occurs during the blocking operation.
*/
export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();
  const postId = formData.get("postId") as string;
  const { id } = await requireUser(request);
  try {
    const res = await prisma.blockedPost.create({
      data: {
        userId: id,
        postId,
      },
    });
    return { ok: true, message: res };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
};
