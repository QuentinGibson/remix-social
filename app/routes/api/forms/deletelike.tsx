import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
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
