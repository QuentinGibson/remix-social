import * as timeago from "timeago.js";
export default function Comment({ comment }: any) {
  return (
    <>
      <li className="my-8" key={comment.id}>
        <div className="flex items-center">
          <img
            className="rounded-full w-8 mr-2"
            src={comment.user.avatar}
            alt="User Avatar"
          />
          <div className="flex justify-between items-center w-full">
            <p className="font-semibold">{comment.user.name}</p>
            <p>{timeago.format(comment.createdAt)}</p>
          </div>
        </div>
        <div className="mt-1">{comment.body}</div>
      </li>
    </>
  );
}
