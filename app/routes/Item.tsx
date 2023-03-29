import TimeAgo from "react-timeago";
import { usePopper } from "react-popper";
import { RiMore2Fill } from "react-icons/ri";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { useRef, useState } from "react";
import LikeButton from "./posts/LikeButton";
import { useThemeContext } from "~/root";

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
  const themeContext = useThemeContext();
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const [showPopper, setShowPopper] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const blockFetcher = useFetcher();
  const darkMood = themeContext.mood === "dark";
  const [queryParams] = useSearchParams();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      { name: "offset", options: { offset: [0, 10] } },
    ],
  });
  const [isHovered, setHovered] = useState(false);
  const [isHoveredTitle, setHoveredTitle] = useState(false);
  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };
  const handleHoverTitle = () => {
    setHoveredTitle(true);
  };

  const handleLeaveTitle = () => {
    setHoveredTitle(false);
  };

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
      <div
        className={`article-container px-4 py-4`}
        style={{ background: themeContext.accent2 }}
      >
        <div className=" rounded-t flex justify-between items-center">
          <div className="flex items-center">
            <img
              className="w-10 rounded-full"
              src={user.avatar}
              alt="Our lovely user"
            />
            <Link
              to={`/user/${user.id}`}
              className={`ml-4 text-base font-semibold leading-4 post-user ${
                darkMood ? "text-white" : "text-black"
              }`}
              onMouseEnter={handleHoverTitle}
              onMouseLeave={handleLeaveTitle}
              style={{ color: isHoveredTitle ? themeContext.accent : "" }}
            >
              {user.name}
            </Link>
          </div>
          <div className="flex items-center">
            <p
              className={`text-base font-medium leading-loose text-right ${
                darkMood ? "text-white" : "text-black"
              } `}
            >
              <TimeAgo date={createdAt} />
            </p>
            <button
              type="button"
              ref={setReferenceElement}
              onClick={togglePopper}
              style={{ color: darkMood ? "#FFFFFF" : "#000000" }}
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
                    <a className="cursor-pointer" onClick={handleBlock}>
                      Block Post
                    </a>
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
        <div className=" py-3">
          <p
            className={`text-2xl font-medium leading-loose ${
              darkMood ? "text-white" : "text-black"
            } post-title`}
          >
            <Link
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
              style={{ color: isHovered ? themeContext.accent : "" }}
              className="post-anchor"
              to={`/posts/${id}`}
            >
              {title}
            </Link>
          </p>
        </div>

        <img
          className="w-full max-w-full"
          src={image}
          alt="an awesome user article"
        />
        <div className=" flex w-full items-center pt-5 justify-between box-border">
          <div className="flex gap-7">
            <div className="flex gap-1 items-center">
              <LikeButton like={like} postId={id} count={likes.length} />
            </div>
            <div
              className={`${
                darkMood ? "text-white" : "text-gray-900"
              } flex gap-1 items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`opacity-50 icon icon-tabler icon-tabler-message-dots`}
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
              <p className="text-sm font-thin leading-loose">
                {comments.length}
              </p>
            </div>
          </div>
          {/* {!seen && (
          <div className="bg-blue-800 px-2 py-1 text-white rounded">
            <p>New!</p>
          </div>
        )} */}
        </div>
      </div>
    </article>
  );
};
export default Item;
