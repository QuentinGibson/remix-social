import { DataFunctionArgs, json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createComment } from "~/models/comment.server";
import { requireUser } from "~/session.server";

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const formData = await request.formData();
    const commentBody = formData.get("comment") as string;
    const postId = formData.get("postId") as string;
    const user = await requireUser(request);
    invariant(commentBody, "Please enter body for your comment");
    invariant(postId, "Please enter a post id");
    const data = await createComment(user.id, postId, commentBody);
    return json({ ok: true, message: data });
  } catch (error: any) {
    return json({ ok: false, message: error.message });
  }
};
