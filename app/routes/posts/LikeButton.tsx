import { useFetcher, useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useOptionalUser } from "~/utils";

const LikeButton = ({ like, count, postId }: any) => {
  const user = useOptionalUser();
  const likeFetcher = useFetcher();
  const isChangeing =
    likeFetcher.state === "submitting" || likeFetcher.state === "loading";
  let optimisticLike = like;

  if (isChangeing) {
    const intent = likeFetcher.formData?.get("intent");
    if (intent === "unlike") {
      optimisticLike = false;
      count--;
    }
    if (intent === "like") {
      optimisticLike = true;
      count++;
    }
  }
  return (
    <div className="flex">
      <likeFetcher.Form
        method="post"
        action={optimisticLike ? "/api/forms/deleteLike" : "/api/forms/newLike"}
        className="flex justify-center"
      >
        <input
          type="hidden"
          name="intent"
          value={optimisticLike ? "unlike" : "like"}
        />
        <input type="hidden" name="postId" value={postId} />
        {user && <input type="hidden" name="userId" value={user.id} />}
        <button className="text-lg mr-2" type="submit">
          {optimisticLike ? <RiHeartFill /> : <RiHeartLine />}
        </button>
        <p className="font-semibold">{count}</p>
      </likeFetcher.Form>
    </div>
  );
};

export default LikeButton;
