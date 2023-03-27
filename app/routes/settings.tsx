import { useCatch, useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/server-runtime";
import { getUserSettings } from "~/models/user.server";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const data = await getUserSettings(user.id);
  console.log(data);
  return json(data);
};
export default function SettingsPage() {
  const { user } = useLoaderData();
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">{user.id}</div>
    </div>
  );
}

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
