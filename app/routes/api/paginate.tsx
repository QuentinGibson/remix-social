import { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPosts } from "~/models/post.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const page = formData.get("page") as string;

  const data = await getPosts(Number(page));
  return json(data);
};
