import { LoaderArgs } from "@remix-run/server-runtime";
import { getTheme } from "~/models/theme.server";
import { getUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  const theme = await getTheme(user?.id ?? "none");
  if (!theme) {
    throw Error("No theme found for use");
  }
  console.log(`Theme data from get request: ${JSON.stringify(theme)}`);
  return theme;
};
