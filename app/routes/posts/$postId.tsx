import { ErrorBoundaryComponent, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useFetchers, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { getPost } from "~/models/post.server";
import { useThemeContext } from "~/root";
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
  const themeContext = useThemeContext();
  const darkMood = themeContext.mood === "dark";

  return (
    <main
      className={`${
        darkMood ? "text-white bg-black" : "text-black bg-white"
      } flex flex-col pt-36 pb-8`}
    >
      <div className="mx-auto max-w-screen-md">
        <h3
          className={`${
            darkMood ? "text-white" : "text-black"
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
            className={`${
              darkMood ? "text-white" : "text-black"
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
                  className={`${
                    darkMood ? "text-white" : "text-black"
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
