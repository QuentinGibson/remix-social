import {
  DataFunctionArgs,
  json,
  LoaderArgs,
  redirect,
} from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createComment } from "~/models/comment.server";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  redirect("/");
};
