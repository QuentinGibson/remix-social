import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export const action: ActionFunction = async (RemixContext) => {
  const redirectURL = RemixContext.request.headers.get("Referer");
  const formData = await RemixContext.request.formData();
  const userId = formData.get("userId") as string;
  const postId = formData.get("postId") as string;

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
};
