import { ActionFunction, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export const action: ActionFunction = async (RemixContext) => {
  const redirectURL = RemixContext.request.headers.get("Referer");
  const formData = await RemixContext.request.formData();
  const userId = formData.get("userId") as string;
  const postId = formData.get("postId") as string;

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
    return json({ ok: false, intent: "like" });
  }
};
