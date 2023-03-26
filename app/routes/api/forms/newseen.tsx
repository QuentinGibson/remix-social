import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createSeen } from "~/models/seen.server";
import { getUser } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const postId = (await request.formData()).get("postId") as string;
  const user = await getUser(request);
  invariant(postId, "Post id must be provided");
  invariant(user, "User id must be provided");
  if (user) {
    const res = await createSeen(user.id, postId);
    console.log(res);
  }
  return redirect("/");
};
