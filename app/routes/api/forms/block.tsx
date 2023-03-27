import { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

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
