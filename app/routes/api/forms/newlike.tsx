import { ActionFunction, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const redirectURL = request.headers.get("Referer");
  const requestId = await requireUserId(request);
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const postId = formData.get("postId") as string;

  if (requestId !== userId) {
    throw Error("User rejected!");
  }
  invariant(userId === "string", "userId must be a string");
  invariant(postId === "string", "postId must be a string");

  invariant(redirectURL, "Must have a original url");
  try {
    await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
    return json({ ok: true, intent: "like" });
  } catch (e: any) {
    return json({ ok: false, intent: "like", error: e.message });
  }
};
