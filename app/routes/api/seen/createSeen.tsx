import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createSeen } from "~/models/seen.server";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const postId = url.searchParams.get("postId");
  const userId = url.searchParams.get("userId");
  invariant(postId, "Post id must be provided");
  invariant(userId, "User id must be provided");
  return createSeen(userId, postId);
};
