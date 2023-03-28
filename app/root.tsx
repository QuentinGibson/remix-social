import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import globalStyleSheet from "./styles/global.css";
import popperCss from "./styles/popper.css";
import { getUser } from "./session.server";
import { useOptionalUser } from "./utils";
import SiteHeader from "./SiteHeader";
import { createContext, useContext } from "react";
import { getTheme } from "./models/theme.server";
import invariant from "tiny-invariant";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: globalStyleSheet },
    { rel: "stylesheet", href: popperCss },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const theme = await getTheme(user?.id || "none");
  invariant(theme, "theme not found");
  return json({
    user,
    theme,
  });
}

const ThemeContext = createContext({
  id: "",
  name: "",
  primary: "",
  secondary: "",
  accent: "",
  accent2: "",
  mood: "",
});
export function useThemeContext() {
  return useContext(ThemeContext);
}

export default function App() {
  const { theme } = useLoaderData();
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ThemeContext.Provider value={theme}>
          <SiteHeader />
          <div className="my-24">
            <Outlet />
          </div>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </ThemeContext.Provider>
      </body>
    </html>
  );
}
