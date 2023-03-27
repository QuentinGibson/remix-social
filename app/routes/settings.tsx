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
      <div className="mx-auto w-full max-w-md px-8">
        <div>
          <h1>Account</h1>
          <Link id="view-profile" to={`/user/${user.id}`}>
            View Profile
          </Link>
        </div>
        <userFetcher.Form method="post">
          <label htmlFor="username">
            Username:
            <br />
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={user.name}
            />
            <br />
          </label>
          <label htmlFor="email">
            Email:
            <br />
            <input
              type="email"
              name="useremail"
              id="email"
              defaultValue={user.email}
            />
            <br />
          </label>
          <label htmlFor="theme">
            Theme:
            <br />
            <select
              defaultValue={user.settings?.theme ?? "light"}
              name="theme"
              id="theme"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <br />
          </label>
          <label htmlFor="notification">
            Notification:
            <br />
            <input
              defaultChecked={user.settings?.notifications ?? false}
              type="checkbox"
              name="notifications"
              id="notifications"
            />
            <br />
          </label>
          <label htmlFor="accessibility">
            Accessibility:
            <br />
            <select
              name="accessibility"
              id="accessibility"
              defaultValue={user.settings?.accessibility ?? "none"}
            >
              <option value="none">None</option>
              <option value="high-contrast">High Contrast</option>
            </select>
            <br />
          </label>
          <label htmlFor="privacy">
            Privacy:
            <br />
            <select
              name="privacy"
              id="privacy"
              defaultValue={user.settings?.privacy ?? "none"}
            >
              <option value="private">Private</option>
              <option value="none">None</option>
            </select>
            <br />
          </label>
          <button id="save-profile" type="submit">
            Save
          </button>
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
