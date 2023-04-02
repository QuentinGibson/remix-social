import type {
  V2_MetaFunction,
  DataFunctionArgs,
  ErrorBoundaryComponent,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";

import { getPosts, getUserFeed } from "~/models/post.server";
import { useThemeContext, useToast } from "~/root";
import Item from "~/routes/Item";
import { getUser } from "~/session.server";
import { useOptionalUser } from "~/utils";

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const user = await getUser(request);

  const data = user
    ? await getUserFeed(user.id, Number(page))
    : await getPosts(Number(page));
  return json(data);
};

export const meta: V2_MetaFunction = () => [{ title: "Group Me Social Media" }];

export default function Index() {
  const { posts, page, count } = useLoaderData<typeof loader>();
  let optimisticPosts = [...posts];
  const maxPage = Math.ceil(Number(count) / 10);
  const sessionUser = useOptionalUser();
  const themeContext = useThemeContext();
  const { showToast } = useToast();
  const darkTheme = themeContext.mood === "dark";
  const actionData = useActionData();
  if (actionData) {
    if (actionData.message && typeof actionData.ok === "boolean") {
      showToast(actionData.message, actionData.ok);
    } else {
      console.log("Weird response!: " + JSON.stringify(actionData));
    }
  }

  const paginateButton = `py-1 px-2 mx-8 rounded-full text-white`;
  function didUserLike(post: { likes: any[] }) {
    const userIds = post.likes.map((like: any) => like.userId);
    return userIds.includes(sessionUser?.id);
  }

  const [queryParams] = useSearchParams();
  const optimisticPage = Number(queryParams.get("page") || 1);
  const isFirstPage = page === 1;
  const isLastPage = page === maxPage;

  const previousQuery = new URLSearchParams(queryParams);
  previousQuery.set("page", (optimisticPage - 1).toString());
  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set("page", (optimisticPage + 1).toString());

  // An effect for appending data to items state

  return (
    <main className={`relative min-h-screen pt-36 ${themeContext.mood}`}>
      {optimisticPosts.map((post) => {
        const like = didUserLike(post);
        return <Item key={post.id} post={post} like={like} />;
      })}
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center justify-center max-w-screen-md">
          {!isFirstPage && (
            <Link
              id="previous-page"
              className={paginateButton}
              style={{ background: themeContext.accent }}
              to={{ pathname: "/", search: previousQuery.toString() }}
            >
              Prev
            </Link>
          )}
          <p
            id="current-page"
            className={`${darkTheme ? "text-white" : "text-black"}`}
          >
            Page: {page}
          </p>
          {!isLastPage && (
            <Link
              id="next-page"
              className={paginateButton}
              style={{ background: themeContext.accent }}
              to={{ pathname: "/", search: nextQuery.toString() }}
            >
              Next
            </Link>
          )}
        </div>
        <div className="flex items-center w-1/3 justify-center">
          <p
            className={`${
              darkTheme ? "text-white" : "text-black"
            } my-4 text-slate-900 text-lg`}
          >
            Showing Page {page} of {maxPage}
          </p>
        </div>
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
