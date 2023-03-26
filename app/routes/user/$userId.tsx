import { json, LoaderArgs } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getUserById } from "~/models/user.server";
import { useUser } from "~/utils";

export async function loader({ params }: LoaderArgs) {
  invariant(params.userId, "postId not found");
  const user = await getUserById(params.userId);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ user });
}

export default function UserRoute() {
  const { user } = useLoaderData<typeof loader>();
  const sessionUser = useUser();

  return (
    <main>
      <div
        className="w-1/3 mx-auto font-extrabold text-4xl pt-10"
        id="container"
      >
        <div className="flex">
          <div className="w-20 mr-10">
            <img src={user.avatar} alt="Avatar" className="rounded-full" />
          </div>
          <h1 className="">{user.name}</h1>
        </div>
      </div>
    </main>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>User not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
