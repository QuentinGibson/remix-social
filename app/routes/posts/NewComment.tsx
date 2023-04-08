/** 
This is a form component for creating a new comment with a character count display 
*/
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";

export default function NewComment({ postId }: { postId: string }) {
  const commentFetcher = useFetcher();
  const [count, setCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const maxCount = 280;

  const isChanging =
    commentFetcher.state === "loading" || commentFetcher.state === "submitting";

  useEffect(() => {
    if (isChanging && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [commentFetcher]);

  const handleChange = () => {
    setCount(inputRef.current?.value?.length ?? 0);
  };

  return (
    <commentFetcher.Form method="post">
      <input type="hidden" name="postId" value={postId} />
      <div className="relative bg-slate-200 ">
        <textarea
          ref={inputRef}
          onChange={handleChange}
          className="w-10/12 px-2 py-4 leading-6 bg-transparent border-0 rounded-lg outline-none resize-none text-slate-800 font-xl h-28"
          name="comment"
          placeholder="Enter your new comment here!"
          id="newcomment"
        />
        <p className={`absolute top-0 right-6 pt-3 text-black`}>
          {count} / {maxCount}
        </p>
        <button
          className="absolute bottom-0 right-0 w-10 h-10 text-black rounded-lg"
          id="submit-button"
          type="submit"
        >
          <BiSend />
        </button>
      </div>
    </commentFetcher.Form>
  );
}
