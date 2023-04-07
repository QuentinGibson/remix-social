import { DataFunctionArgs, redirect } from "@remix-run/node";
import { populateTheme } from "~/models/theme.server";
import { requireUser } from "~/session.server";
/**
 * Performs an action that populates the theme and redirects the user to the home page if they are an admin.
 *
 * @async
 * @function
 * @param {DataFunctionArgs} { request } - The data function arguments.
 * @param {Object} request - The HTTP request object.
 * @param {User} request.user - The user object retrieved from the request.
 * @returns {Promise<{ redirect: string, status: number }>} The HTTP response object
 * @throws {Error} If there was an error requiring the user or redirecting.
 */

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    // Will throw if there is no user
    const user = await requireUser(request);
    if (!user) redirect("/login", { status: 302 });
    if (!user.isAdmin) redirect("/", { status: 302 });
    await populateTheme();
    return redirect("/", { status: 204 });
  } catch (error) {
    return { redirect: "/login", status: 302 };
  }
};
