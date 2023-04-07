import { LoaderArgs } from "@remix-run/server-runtime";
import { getTheme } from "~/models/theme.server";
import { getUser } from "~/session.server";
/**

Asynchronously retrieves the theme of a user from the backend.
@async
@function loader
@param {Object} LoaderArgs - An object containing the request to be made.
@param {Object} LoaderArgs.request - The request to be made.
@returns {Promise<string>} - A promise that resolves with the user's theme if successful.
@throws {Error} - Throws an error if no theme is found for the user.
*/

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  const theme = await getTheme(user?.id ?? "none");
  if (!theme) {
    throw Error("No theme found for use");
  }
  return theme;
};
