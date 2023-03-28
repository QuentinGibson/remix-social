import { Link, useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import {
  DataFunctionArgs,
  json,
  LoaderArgs,
  redirect,
} from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getUserSettings, updateUserById } from "~/models/user.server";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const data = await getUserSettings(user.id);
  return json(data);
};
export default function SettingsPage() {
  const user = useLoaderData<typeof loader>();
  const userFetcher = useFetcher();
  if (!user) {
    throw redirect("/");
  }
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-screen-sm px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Account</h1>
        </div>
        <userFetcher.Form method="post">
          <label className="text-2xl" htmlFor="username">
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
          <label htmlFor="email">
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
          <label htmlFor="theme">
            Theme:
            <br />
          </label>
          <select
            className="bg-slate-300 border-slate-900 border-2 border-solid p-1 text-lg w-96"
            defaultValue={user.settings?.theme ?? "light"}
            name="theme"
            id="theme"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <br />
          <label htmlFor="notification">
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
          <label htmlFor="accessibility">
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
          <label htmlFor="privacy">
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
          <div className="flex justify-between mt-4">
            <button
              id="save-profile"
              type="submit"
              className="bg-cyan-800 px-3 py-2 rounded-xl text-white"
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
    </div>
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
