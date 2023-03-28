import { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useFetchers, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getPost } from "~/models/post.server";
import { getUser } from "~/session.server";
import { canBeOptimistic, useOptionalUser } from "~/utils";
import Comment from "./Comment";
import LikeButton from "./LikeButton";
import NewComment from "./NewComment";
import "./post.css";

export async function loader({ params, request }: LoaderArgs) {
  const user = await getUser(request);
  invariant(params.postId, "postId not found");
  const post = await getPost(params.postId);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  const userLikes = post.likes.map((like) => like.userId);
  const like = user ? userLikes.includes(user?.id) : false;
  return json({ post, like });
}

export default function PostRoute() {
  const { post, like } = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col pt-4">
      <div className="mx-auto max-w-screen-md">
        <h3 className="text-4xl font-bold mb-8">{post.title}</h3>
        <img className="mb-6" src={post.image} alt="The post you submitted" />
        <div className="flex">
          <LikeButton like={like} count={post.likes.length} postId={post.id} />
        </div>
        <footer>
          <h3 className="font-medium text-lg mb-2">
            Comments: {post.comments.length}
          </h3>
          <NewComment postId={post.id} />
          <div>
            <ul id="comments">
              {post.comments ? (
                post.comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))
              ) : (
                <h3>No Comments! Add the first one</h3>
              )}
            </ul>
          </div>
        </footer>
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
    return <div>Post not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
