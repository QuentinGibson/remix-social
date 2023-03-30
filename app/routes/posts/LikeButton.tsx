import { useActionData, useFetcher, useNavigation } from "@remix-run/react";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useThemeContext, useToast } from "~/root";
import { useOptionalUser } from "~/utils";
import { action as likeAction } from "~/routes/api/forms/newlike";
import { useEffect } from "react";

const LikeButton = ({ like, count, postId }: any) => {
  const user = useOptionalUser();
  const likeFetcher = useFetcher<typeof likeAction>();
  const themeContext = useThemeContext();
  const { showToast } = useToast();
  const darkMood = themeContext.mood === "dark";
  const isChangeing =
    likeFetcher.state === "submitting" || likeFetcher.state === "loading";
  const isLoading = likeFetcher.state === "loading";
  let optimisticLike = like;

  useEffect(() => {
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
    if (isLoading) {
      if (likeFetcher.data) {
        if (likeFetcher.data.ok) {
          showToast(likeFetcher.data.message, false);
        } else {
          showToast(likeFetcher.data.message, true);
        }
      }
    }
  }, [isChangeing, likeFetcher]);

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
        <button className={`text-lg mr-2 like-button`} type="submit">
          {optimisticLike ? <RiHeartFill /> : <RiHeartLine />}
        </button>
        <p
          className={`font-semibold ${
            darkMood ? "text-white" : "text-dark"
          } total-likes`}
        >
          {count}
        </p>
      </likeFetcher.Form>
    </div>
  );
};

export default LikeButton;
