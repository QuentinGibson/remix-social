import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback } from "react";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import invariant from "tiny-invariant";
import { getPost } from "~/models/post.server";
import { useOptionalUser } from "~/utils";
import Comment from "./Comment";
import "./post.css";

export async function loader({ params }: LoaderArgs) {
  invariant(params.postId, "postId not found");
  const post = await getPost(params.postId);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
}

export default function PostRoute() {
  const { post } = useLoaderData<typeof loader>();
  const userLikes = post.likes.map((like) => like.userId);
  const likeFetcher = useFetcher();
  const commentFetcher = useFetcher();
  const user = useOptionalUser();
  const like = user ? userLikes.includes(user.id) : false;

  const handleLike = useCallback(async () => {
    if (!like && user) {
      likeFetcher.submit(
        { userId: user.id, postId: post.id },
        {
          method: "post",
          action: `/api/forms/newlike`,
          preventScrollReset: true,
        }
      );
    }
  }, [post.id, likeFetcher, like, user]);
  const handleUnlike: any = useCallback(async () => {
    if (like && user) {
      likeFetcher.submit(
        { userId: user.id, postId: post.id },
        {
          method: "post",
          action: `/api/forms/deletelike`,
          preventScrollReset: true,
        }
      );
    }
  }, [post.id, likeFetcher, like, user?.id]);

  return (
    <main className="flex flex-col">
      <div className="mx-auto w-1/3">
        <h3 className="text-4xl font-bold mb-12">{post.title}</h3>
        <img src={post.image} alt="The post you submitted" />
        <div className="flex mt-8">
          {!like ? (
            <button onClick={handleLike}>
              <RiHeartLine />
            </button>
          ) : (
            <button onClick={handleUnlike}>
              <RiHeartFill />
            </button>
          )}
          <p>{post.likes.length}</p>
        </div>
        <footer>
          <h3>Comments: {post.comments.length}</h3>
          <commentFetcher.Form method="post" action="/api/forms/newcomment">
            <input type="hidden" name="postId" value={post.id} />
            <textarea
              className="border-solid border-2 border-gray-900 w-full"
              name="comment"
              placeholder="Enter your new comment here!"
              id="newcomment"
            />
            <button type="submit">Create Comment</button>
          </commentFetcher.Form>

          <div>
            <ul>
              {post.comments &&
                post.comments.map((comment) => <Comment comment={comment} />)}
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
