import { useFetcher } from "@remix-run/react";
import { useRef, useState } from "react";
import { BiSend } from "react-icons/bi";

export default function NewComment({ postId }: { postId: string }) {
  const [count, setCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const maxCount = 280;

  const handleChange = () => {
    setCount(inputRef.current?.value?.length ?? 0);
  };
  const commentFetcher = useFetcher();
  return (
    <commentFetcher.Form method="post" action="/api/forms/newcomment">
      <input type="hidden" name="postId" value={postId} />
      <div className="relative bg-slate-200 ">
        <textarea
          ref={inputRef}
          onChange={handleChange}
          className="border-0 outline-none text-slate-800 font-xl w-10/12 bg-transparent px-2 py-4 h-28 resize-none rounded-lg leading-6"
          name="comment"
          placeholder="Enter your new comment here!"
          id="newcomment"
        />
        <p className="absolute top-0 right-6 pt-3">
          {count} / {maxCount}
        </p>
        <button
          className="absolute bottom-0 right-0 rounded-lg w-10 h-10"
          type="submit"
        >
          <BiSend />
        </button>
      </div>
    </commentFetcher.Form>
  );
}