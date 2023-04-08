/**
A component that renders a single comment in a list of comments.
*/
import { Link } from "@remix-run/react";
import { useState } from "react";
import TimeAgo from "react-timeago";
import { useThemeContext } from "~/root";

interface CommentProps {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  createdAt: Date;
  body: string;
}

interface Props {
  comment: CommentProps;
}

// The Comment component renders a single comment within a list of comments
export default function Comment({ comment }: Props) {
  // Define state for when the user hovers over the comment
  const [userHovered, setUserHovered] = useState(false);

  // Get the theme from the context
  const themeContext = useThemeContext();
  return (
    <>
      {/* Render the comment */}
      <li className="my-8" key={comment.id}>
        <div className="flex items-center">
          {/* Render the user's avatar */}
          <img
            className="w-8 mr-2 rounded-full comment-avatar"
            src={comment.user.avatar}
            alt="User Avatar"
          />
          <div className="flex items-center justify-between w-full">
            {/* Render a link to the user's profile */}
            <Link
              to={`/user/${comment.user.id}`}
              onMouseOver={() => setUserHovered(true)}
              onMouseLeave={() => setUserHovered(false)}
              style={{ color: userHovered ? themeContext.accent : "" }}
              className={`font-semibold`}
            >
              {/* Render the user's name */}
              {comment.user.name}
            </Link>
            {/* Render the time since the comment was created */}
            <p>
              <TimeAgo date={comment.createdAt} />
            </p>
          </div>
        </div>
        {/* Render the comment body */}
        <div className="mt-1">{comment.body}</div>
      </li>
    </>
  );
}
