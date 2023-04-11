import {
  DataFunctionArgs,
  ErrorBoundaryComponent,
  LoaderArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useActionData,
  useCatch,
  useFetchers,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";
import invariant from "tiny-invariant";
import { createComment } from "~/models/comment.server";
import { getPost } from "~/models/post.server";
import { useThemeContext, useToast } from "~/root";
import { getUser, requireUser } from "~/session.server";
import { canBeOptimistic, useOptionalUser } from "~/utils";
import Comment from "./Comment";
import LikeButton from "./LikeButton";
import NewComment from "./NewComment";
import "./post.css";

export const meta = () => ([{ title: "Post" }]);

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
  const themeContext = useThemeContext();
  const darkMood = themeContext.mood === "dark";
  const { showToast } = useToast();
  const actionData = useActionData();
  return (
    <main
      className={`${darkMood ? "text-white bg-black" : "text-black bg-white"
        } flex flex-col pt-36 pb-8`}
    >
      <div className="max-w-screen-md mx-auto">
        <h3
          className={`${darkMood ? "text-white" : "text-black"
            } text-4xl font-bold mb-8`}
        >
          {post.title}
        </h3>

        <img className="mb-6" src={post.image} alt="The post you submitted" />
        <div className="flex">
          <LikeButton like={like} count={post.likes.length} postId={post.id} />
        </div>
        <footer>
          <h3
            className={`${darkMood ? "text-white" : "text-black"
              } font-medium text-lg mb-2`}
          >
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
                <h3
                  className={`${darkMood ? "text-white" : "text-black"
                    } no-comments`}
                >
                  No Comments! Add the first one
                </h3>
              )}
            </ul>
          </div>
        </footer>
      </div>
    </main>
  );
}

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const formData = await request.formData();
    const commentBody = formData.get("comment") as string;
    const postId = formData.get("postId") as string;
    const user = await requireUser(request);
    invariant(commentBody, "Please enter body for your comment");
    invariant(postId, "Please enter a post id");
    const data = await createComment(user.id, postId, commentBody);
    return json({ ok: true, message: data, intent: "newcomment" });
  } catch (error: any) {
    return json({ ok: false, message: error.message, intent: "newcomment" });
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
