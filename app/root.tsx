import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import popperCss from "./styles/popper.css";
import { getUser } from "./session.server";
import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: popperCss },
  ];
};

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  const user = useOptionalUser();
  const linkClassName =
    "mx-2 my-2 bg-blue-600 transition duration-150 ease-in-out hover:bg-blue-400 rounded text-white px-4 py-2 text-sm";
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <header className="bg-cyan-900 h-20 fixed w-full z-50 top-0">
          <div className="mx-24 h-full">
            <nav className="flex box-border  items-center w-full h-full justify-between">
              <Link
                to="/"
                className="text-white font-extrabold text-2xl flex items-center"
              >
                <img
                  src="/group-me-logo.png"
                  alt="Group-me symbol"
                  width={30}
                  className="mr-2"
                />
                GroupMe
              </Link>
              <ul className="flex items-center list-none gap-4">
                {user ? (
                  <>
                    <li className="">
                      <Link className={linkClassName} to={`/settings`}>
                        Edit User
                      </Link>
                    </li>
                    <li>
                      <Link className={linkClassName} to="/newpost">
                        Create Post
                      </Link>
                    </li>
                    <li>
                      <Form method="post" action="/logout">
                        <button className={linkClassName} type="submit">
                          Logout
                        </button>
                      </Form>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link className={linkClassName} to="/login">
                      Login
                    </Link>
                    <Link className={linkClassName} to="/join">
                      Sign Up
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </header>

        <div className="my-24">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
