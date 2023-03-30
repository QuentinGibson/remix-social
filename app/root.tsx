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
import SiteHeader from "./SiteHeader";
import { createContext, useContext } from "react";
import { getTheme } from "./models/theme.server";
import invariant from "tiny-invariant";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const links: LinksFunction = () => {
  const reactToastify =
    "https://cdn.jsdelivr.net/npm/react-toastify/dist/ReactToastify.min.css";

  return [
    { rel: "stylesheet", href: reactToastify, type: "text/css" },
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

type ToastContextType = {
  showToast: (message: string, error: boolean) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

function ToastProvider(props: { children: React.ReactNode }) {
  const showToast = (message: string, error: boolean) => {
    if (error) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {props.children}
      <ToastContainer autoClose={5000} position="bottom-right" />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
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
      <ThemeContext.Provider value={theme}>
        <body className={`h-full`}>
          <ToastProvider>
            <>
              <SiteHeader />
              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </>
          </ToastProvider>
        </body>
      </ThemeContext.Provider>
    </html>
  );
}
