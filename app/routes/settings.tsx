import { Link, useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import {
  DataFunctionArgs,
  json,
  LoaderArgs,
  redirect,
} from "@remix-run/server-runtime";
import { getUserSettings, updateUserById } from "~/models/user.server";
import { useThemeContext } from "~/root";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const data = await getUserSettings(user.id);
  return json(data);
};
export default function SettingsPage() {
  const { user, themeList } = useLoaderData<typeof loader>();
  const userFetcher = useFetcher();
  const themeContext = useThemeContext();
  const darkMood = themeContext.mood === "dark";

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
            className="bg-slate-300 border-slate-900 border-2 border-solid p-1 text-lg w-96"
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
            className="bg-slate-300 border-slate-900 border-2 border-solid p-1 text-lg w-96"
            type="email"
            name="useremail"
            id="email"
            defaultValue={user.email}
          />
          <br />
          <label
            className={`${darkMood ? "text-white" : "text-dark"} text-2xl`}
            htmlFor="theme"
          >
            Theme:
            <br />
          </label>
          <select
            className="bg-slate-300 border-slate-900 border-2 border-solid p-1 text-lg w-96"
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
              className="bg-slate-300 border-slate-900 border-2 border-solid p-1 text-lg"
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
            className="bg-slate-300 border-slate-900 border-2 border-solid p-1 text-lg w-96"
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
            className="bg-slate-300 border-slate-900 border-2 border-solid p-1 text-lg w-96"
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
              className="bg-cyan-800 px-3 py-2 rounded-xl mr-8 text-white"
            >
              Save
            </button>
            <Link
              className="py-2 px-2 bg-slate-500 text-white rounded-lg hover:bg-slate-400"
              id="view-profile"
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
    return { ok: true, message: "user updated" };
  } catch (error) {
    return {
      ok: false,
      message: "update failed",
    };
  }
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>User Settings not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
