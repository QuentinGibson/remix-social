import { Form, Link } from "@remix-run/react";
import { useThemeContext } from "./root";
import { useOptionalUser } from "./utils";

export default function SiteHeader() {
  const user = useOptionalUser();
  const themeContext = useThemeContext();
  const mood = themeContext.mood === "dark";

  const linkClassName = `${
    mood && "text-white"
  } mx-2 my-2 transition duration-150 ease-in-out hover:bg-blue-400 rounded px-4 py-2 text-sm`;
  const linkStyle = { backgroundColor: themeContext.secondary };
  return (
    <header
      style={{ backgroundColor: themeContext.primary }}
      className="h-20 fixed w-full z-50 top-0"
    >
      <div className="mx-24 h-full">
        <nav className="flex box-border items-center w-full h-full justify-between">
          <Link
            to="/"
            className={`${
              mood && "text-white"
            } font-extrabold text-2xl flex items-center`}
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
                  <Link
                    style={linkStyle}
                    className={linkClassName}
                    to={`/settings`}
                  >
                    Edit User
                  </Link>
                </li>
                <li>
                  <Link
                    style={linkStyle}
                    className={linkClassName}
                    to="/newpost"
                  >
                    Create Post
                  </Link>
                </li>
                <li>
                  <Form method="post" action="/logout">
                    <button
                      style={linkStyle}
                      className={linkClassName}
                      type="submit"
                    >
                      Logout
                    </button>
                  </Form>
                </li>
              </>
            ) : (
              <li>
                <Link style={linkStyle} className={linkClassName} to="/login">
                  Login
                </Link>
                <Link style={linkStyle} className={linkClassName} to="/join">
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
