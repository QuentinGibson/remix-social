import { Link } from "@remix-run/react";
import { useState } from "react";
import TimeAgo from "react-timeago";
import { useThemeContext } from "~/root";

export default function Comment({ comment }: any) {
  const [userHovered, setUserHovered] = useState(false);
  const themeContext = useThemeContext();
  return (
    <>
      <li className="my-8" key={comment.id}>
        <div className="flex items-center">
          <img
            className="rounded-full w-8 mr-2 comment-avatar"
            src={comment.user.avatar}
            alt="User Avatar"
          />
          <div className="flex justify-between items-center w-full">
            <Link
              to={`/user/${comment.user.id}`}
              onMouseOver={() => setUserHovered(true)}
              onMouseLeave={() => setUserHovered(false)}
              style={{ color: userHovered ? themeContext.accent : "" }}
              className={`font-semibold`}
            >
              {comment.user.name}
            </Link>
            <p>
              <TimeAgo date={comment.createdAt} />
            </p>
          </div>
        </div>
        <div className="mt-1">{comment.body}</div>
      </li>
    </>
  );
}
