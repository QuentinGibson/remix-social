import { DataFunctionArgs, redirect } from "@remix-run/node";
import { populateTheme } from "~/models/theme.server";
import { requireUser } from "~/session.server";

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const user = await requireUser(request);
    if (!user) redirect("/login", { status: 302 });
    if (!user.isAdmin) redirect("/", { status: 302 });
    if (user.isAdmin) {
      await populateTheme();
      return redirect("/", { status: 204 });
    }
  } catch (error) {
    return { redirect: "/login", status: 302 };
  }
};
