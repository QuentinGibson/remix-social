import {
  Link,
  useActionData,
  useCatch,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
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
      className={`flex min-h-full flex-col justify-center ${
        darkMood ? "bg-black" : "bg-white"
      }`}
    >
      <div className="mx-auto w-full max-w-screen-sm px-8">
        <div className="flex justify-between items-center">
          <h1
            className={`text-3xl font-semibold mb-4 ${
              darkMood ? "text-white" : "text-black"
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
            className={`${
              darkMood ? "bg-slate-100" : "bg-slate-200"
            } border-0  p-1 text-lg w-96`}
            type="text"
            name="username"
            id="username"
            defaultValue={user.name}
          />
          <br />
          <label
            className={`${darkMood ? "text-white" : "text-dark"} text-2xl`}
            htmlFor="email"
          >
            Email:
            <br />
          </label>
          <input
            className={`${
              darkMood ? "bg-slate-100" : "bg-slate-200"
            }  border-0  p-1 text-lg w-96`}
            type="email"
            name="useremail"
            id="useremail"
            defaultValue={user.email}
          />
          <br />
          <label
            className={`text-2xl ${darkMood ? "text-white" : "text-dark"}`}
            htmlFor="username"
          >
            Theme:
            <br />
          </label>
          <select
            className={`${
              darkMood ? "bg-slate-100" : "bg-slate-200"
            }  p-1 text-lg w-96`}
            defaultValue={user.settings?.themeId}
            name="theme"
            id="theme"
          >
            {themeListOptions}
          </select>
          <br />
          <label
            className={`${darkMood ? "text-white" : "text-dark"} text-2xl`}
            htmlFor="notification"
          >
            Notification:
            <br />
          </label>
          <div className="flex justify-start">
            <input
              className="  p-1 text-lg"
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
            className={`${
              darkMood ? "bg-slate-100" : "bg-slate-200"
            }  p-1 text-lg w-96s`}
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
            className={`${
              darkMood ? "bg-slate-100" : "bg-slate-200"
            }  p-1 text-lg w-96`}
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
              className="px-3 py-2 rounded-xl mr-8 text-white"
              style={{ background: themeContext.accent }}
            >
              Save
            </button>
            <Link
              className="py-2 px-2 bg-slate-500 text-white rounded-lg hover:bg-slate-400"
              id="view-profile"
              style={{ background: themeContext.accent2 }}
              to={`/user/${user.id}`}
            >
              View Profile
            </Link>
          </div>
        </userFetcher.Form>
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
      <div className="flex justify-center items-center flex-col">
        <div className="flex flex-col justify-center items-center mb-12 font-bold">
          <h1 className="text-3xl mb-4">We're Sorry!</h1>
          <p className="text-xl">
            It seem like getting your request failed with the error below!
          </p>
        </div>
        <div className="flex flex-col justify-center items-center bg-red-800 px-8 py-4 h-24 rounded text-white">
          Error Message:
          <span className="text-base mt-2">{error.message}</span>
        </div>
      </div>
    </div>
  );
};
