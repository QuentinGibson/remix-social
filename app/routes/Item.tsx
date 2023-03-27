import * as timeago from "timeago.js";
import { usePopper } from "react-popper";
import { RiHeartFill, RiHeartLine, RiMore2Fill } from "react-icons/ri";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { useCallback, useRef, useState } from "react";
import { useOptionalUser } from "~/utils";

const Item = ({
  post: { id, title, image, likes, createdAt, comments, user },
  like,
}: {
  post: any;
  like: boolean;
}) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const [showPopper, setShowPopper] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const likeFetcher = useFetcher();
  const sessionUser = useOptionalUser();
  const blockFetcher = useFetcher();
  const [queryParams] = useSearchParams();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      { name: "offset", options: { offset: [0, 10] } },
    ],
  });

  const handleLike = useCallback(async () => {
    if (!like && sessionUser) {
      likeFetcher.submit(
        { userId: sessionUser.id, postId: id },
        {
          method: "post",
          action: `/api/forms/newlike`,
          preventScrollReset: true,
        }
      );
    }
  }, [id, likeFetcher, like, sessionUser]);
  const handleUnlike: any = useCallback(async () => {
    if (like && sessionUser) {
      likeFetcher.submit(
        { userId: sessionUser.id, postId: id },
        {
          method: "post",
          action: `/api/forms/deletelike`,
          preventScrollReset: true,
        }
      );
    }
  }, [id, likeFetcher, like, sessionUser]);
  const togglePopper = () => {
    setShowPopper(!showPopper);
  };

  const handleBlock = () => {
    blockFetcher.submit(
      { postId: id },
      { method: "post", action: "/api/forms/block" }
    );
  };
  const userQuery = new URLSearchParams(queryParams);
  userQuery.set("userId", user.id);

  const postQuery = new URLSearchParams(queryParams);
  postQuery.set("postId", id);

  return (
    <article
      ref={ref}
      key={id}
      role="article"
      className="mx-auto relative max-w-xl sm:pb-16 sm:pt-8"
    >
      <div className="bg-white rounded-t flex justify-between items-center">
        <div className="flex items-center">
          <img
            className="w-10 rounded-full"
            src={user.avatar}
            alt="Our lovely user"
          />
          <Link
            to={`/user/${user.id}`}
            className="ml-4 text-base font-semibold leading-4 text-gray-800 post-user"
          >
            {user.name}
          </Link>
        </div>
        <div className="flex items-center">
          <p className="text-base font-medium leading-loose text-right text-gray-900 ">
            {timeago.format(createdAt)}
          </p>
          <button
            type="button"
            ref={setReferenceElement}
            onClick={togglePopper}
          >
            <RiMore2Fill className="ml-3 cursor-pointer mt-1" />
          </button>

          {showPopper && (
            <div
              ref={setPopperElement}
              style={{
                ...styles.popper,
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "4px",
                padding: "10px",
              }}
              {...attributes.popper}
            >
              <ul>
                <li>
                  <Link to={{ pathname: `/user/${user.id}` }}>See user</Link>
                </li>
                <li>
                  <Link to={{ pathname: `/posts/${id}` }}>View Page</Link>
                </li>
                <li>
                  <a onClick={handleBlock}>Block Post</a>
                </li>
              </ul>
              <div
                ref={setArrowElement}
                style={{
                  ...styles.arrow,
                  backgroundColor: "#333",
                  width: "10px",
                  height: "10px",
                  transform: "rotate(45deg)",
                  left: "50%",
                  top: -3,
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white py-3">
        <p className="text-2xl font-medium leading-loose text-gray-500 dark:text-gray-900 post-title">
          <Link className="post-anchor" to={`/posts/${id}`}>
            {title}
          </Link>
        </p>
      </div>

      <img
        className="w-full max-w-full"
        src={image}
        alt="an awesome user article"
      />
      <div className="bg-white flex w-full items-center py-5 justify-between box-border">
        <div className="flex gap-7">
          <div className="flex gap-1 items-center">
            {!like ? (
              <button
                className="like-button"
                role="button"
                onClick={handleLike}
              >
                <RiHeartLine />
              </button>
            ) : (
              <button
                className="like-button"
                role="button"
                onClick={handleUnlike}
              >
                <RiHeartFill />
              </button>
            )}
            <p className="text-sm font-light leading-loose text-gray-900 total-likes">
              {likes.length}
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-900 opacity-50 icon icon-tabler icon-tabler-message-dots"
              width={25}
              height={25}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
              <line x1={12} y1={11} x2={12} y2="11.01" />
              <line x1={8} y1={11} x2={8} y2="11.01" />
              <line x1={16} y1={11} x2={16} y2="11.01" />
            </svg>
            <p className="text-sm font-thin leading-loose">{comments.length}</p>
          </div>
        </div>
        {/* {!seen && (
          <div className="bg-blue-800 px-2 py-1 text-white rounded">
            <p>New!</p>
          </div>
        )} */}
      </div>
    </article>
  );
};
export default Item;
