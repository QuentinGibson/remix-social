import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import {
  DataFunctionArgs,
  ErrorBoundaryComponent,
  json,
  LoaderArgs,
  redirect,
} from "@remix-run/server-runtime";
import { useEffect } from "react";
import { getUserSettings, updateUserById } from "~/models/user.server";
import { useThemeContext, useToast } from "~/root";
import { requireUser } from "~/session.server";

export const meta = () => ([{ title: "Settings" }]);

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const data = await getUserSettings(user.id);
  return json(data);
};
export default function SettingsPage() {
  const { user, themeList } = useLoaderData<typeof loader>();
  const userFetcher = useFetcher<typeof action>();
  const themeContext = useThemeContext();
  const { showToast } = useToast();
  const darkMood = themeContext.mood === "dark";
  useEffect(() => {
    if (userFetcher.state === "loading") {
      if (userFetcher.data) {
        showToast(userFetcher.data.message, !userFetcher.data.ok);
      }
    }
  }, [userFetcher, showToast]);

  const themeListOptions = themeList.map((theme) => (
    <option key={theme.id} value={theme.id}>
      {theme.name}
    </option>
  ));
  if (!user) {
    throw redirect("/");
  }
  return (
    <main
      className={`flex min-h-full flex-col justify-center ${darkMood ? "bg-black" : "bg-white"
        }`}
    >
      <div className="w-full max-w-screen-sm px-8 mx-auto">
        <div className="flex items-center justify-between">
          <h1
            className={`mb-4 text-5xl font-semibold ${darkMood ? "text-white" : "text-black"
              }`}
          >
            Account
          </h1>
        </div>
        <userFetcher.Form method="post">
          <label
            className={`text-2xl ${darkMood ? "text-white" : "text-dark"}`}
            htmlFor="username"
          >
            Username:
            <br />
          </label>
          <input
            className={`${darkMood ? "bg-slate-100" : "bg-slate-200"
              } w-96  border-0 p-1 text-lg`}
            type="text"
            name="username"
            id="username"
            defaultValue={user.name}
          />
          <br />
          <label
            className={`${darkMood ? "text-white" : "text-dark"} text-2xl`}
            htmlFor="useremail"
          >
            Email:
            <br />
          </label>
          <input
            className={`${darkMood ? "bg-slate-100" : "bg-slate-200"
              }  w-96  border-0 p-1 text-lg`}
            type="email"
            name="useremail"
            id="useremail"
            defaultValue={user.email}
          />
          <br />
          <label
            className={`text-2xl ${darkMood ? "text-white" : "text-dark"}`}
            htmlFor="theme"
          >
            Theme:
            <br />
          </label>
          <select
            className={`${darkMood ? "bg-slate-100" : "bg-slate-200"
              }  w-96 p-1 text-lg`}
            defaultValue={user.settings?.themeId}
            name="theme"
            id="theme"
          >
            {themeListOptions}
          </select>
          <br />
          <label
            className={`${darkMood ? "text-white" : "text-dark"} text-2xl`}
            htmlFor="notifications"
          >
            Notification:
            <br />
          </label>
          <div className="flex justify-start">
            <input
              className="p-1 text-lg "
              defaultChecked={user.settings?.notifications ?? false}
              type="checkbox"
              name="notifications"
              id="notifications"
            />
          </div>
          <br />
          <label
            className={`${darkMood ? "text-white" : "text-dark"} text-2xl`}
            htmlFor="accessibility"
          >
            Accessibility:
            <br />
          </label>
          <select
            className={`${darkMood ? "bg-slate-100" : "bg-slate-200"
              }  w-96s p-1 text-lg`}
            name="accessibility"
            id="accessibility"
            defaultValue={user.settings?.accessibility ?? "none"}
          >
            <option value="none">None</option>
            <option value="high-contrast">High Contrast</option>
          </select>
          <br />
          <label
            className={`${darkMood ? "text-white" : "text-dark"} text-2xl`}
            htmlFor="privacy"
          >
            Privacy:
            <br />
          </label>
          <select
            className={`${darkMood ? "bg-slate-100" : "bg-slate-200"
              }  w-96 p-1 text-lg`}
            name="privacy"
            id="privacy"
            defaultValue={user.settings?.privacy ?? "none"}
          >
            <option value="private">Private</option>
            <option value="none">None</option>
          </select>

          <br />
          <div className="flex mt-4">
            <button
              id="save-profile"
              type="submit"
              className={`px-3 py-2 mr-8 ${darkMood ? "text-white" : "text-black"} rounded-xl`}
              style={{ background: themeContext.accent }}
            >
              Save
            </button>
            <Link
              className={` px-2 py-2 ${darkMood ? "text-white" : "text-black"} rounded-lg bg-slate-500 hover:bg-slate-400 `}
              id="view-profile"
              style={{ background: themeContext.accent2 }}
              to={`/user/${user.id}`}
            >
              View Profile
            </Link>
          </div>
        </userFetcher.Form>
        {user.isAdmin && (
          <div className="flex gap-8 mx-auto mt-4 max-screen-w-md">
            <Form method="post" action="/api/admin/populatePosts">
              <button
                id="admin-posts"
                className="px-2 py-2 text-white bg-red-900 rounded-lg hover:bg-red-400"
              >
                Create Sample Posts
              </button>
            </Form>
            <Form method="post" action="/api/admin/createThemes">
              <button
                id="admin-themes"
                className="px-2 py-2 text-white bg-red-900 rounded-lg hover:bg-red-400"
              >
                Create Default Themes
              </button>
            </Form>
          </div>
        )}
      </div>
    </main>
  );
}

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();
  const user = await requireUser(request);
  try {
    await updateUserById(user.id, formData);
    return json({ ok: true, message: "user updated" });
  } catch (error) {
    return json({
      ok: false,
      message: "update failed",
    });
  }
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div className="pt-36">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-12 font-bold">
          <h1 className="mb-4 text-3xl">We're Sorry!</h1>
          <p className="text-xl">
            It seem like getting your request failed with the error below!
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-24 px-8 py-4 text-white bg-red-800 rounded">
          Error Message:
          <span className="mt-2 text-base">{error.message}</span>
        </div>
      </div>
    </div>
  );
};
