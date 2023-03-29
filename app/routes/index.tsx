import type { V2_MetaFunction, DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";

import { getPosts, getUserFeed } from "~/models/post.server";
import { useThemeContext } from "~/root";
import Item from "~/routes/Item";
import { getUser } from "~/session.server";
import { useOptionalUser } from "~/utils";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
  count: number;
};

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

function canBeOptimistic(fetcher: { state: string; data: any }) {
  return (
    fetcher.state === "submitting" ||
    (fetcher.state === "loading" && fetcher.data?.type === "success")
  );
}

export default function Index() {
  const { posts, page, count } = useLoaderData<typeof loader>();
  let optimisticPosts = [...posts];
  const maxPage = Math.ceil(Number(count) / 10);
  const paginateButton = `bg-slate-600 py-1 px-2 mx-8 rounded-full text-white`;
  const sessionUser = useOptionalUser();
  const themeContext = useThemeContext();

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
        <div className="flex items-center justify-center w-1/3">
          {!isFirstPage && (
            <Link
              className={paginateButton}
              to={{ pathname: "/", search: previousQuery.toString() }}
            >
              Prev
            </Link>
          )}
          <p>Page: {page}</p>
          {!isLastPage && (
            <Link
              className={paginateButton}
              to={{ pathname: "/", search: nextQuery.toString() }}
            >
              Next
            </Link>
          )}
        </div>
        <div className="flex items-center w-1/3 justify-center">
          <p className="my-4 text-slate-900 text-lg">
            Showing Page {page} of {maxPage}
          </p>
        </div>
      </div>
    </main>
  );
}
