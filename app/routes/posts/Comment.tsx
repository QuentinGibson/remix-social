import * as timeago from "timeago.js";
export default function Comment({ comment }: any) {
  return (
    <>
      <li>
        <div>
          <p>
            {comment.user.name} - {timeago.format(comment.createdAt)}
          </p>
        </div>
        <div>{comment.body}</div>
      </li>
    </>
  );
}
