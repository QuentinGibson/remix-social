import {
  ActionFunction,
  LoaderFunction,
  redirect,
  UploadHandler,
} from "@remix-run/node";
import {
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import { uploadImage } from "~/uploader-handler.server";
import { requireUserId } from "~/session.server";
import { createPost } from "~/models/post.server";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

/**

Asynchronously creates a post with an uploaded image by the current user.
@async
@function action
@param {Object} DataFunctionArgs - An object containing the request to be made.
@param {Object} DataFunctionArgs.request - The request to be made.
@returns {Promise<Object>} - A promise that resolves with a redirect to the home page after the post is successfully created.
@throws {Error} - Throws an error if there is missing data or if an error occurs during the post creation process.
*/
export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const cloudifyUpload: UploadHandler = async ({ name, data, filename }) => {
    if (name !== "upload") {
      return undefined;
    }
    const uploadedImage = await uploadImage(data);
    return uploadedImage.secure_url;
  };
  const cloudifyUploadHandler = unstable_composeUploadHandlers(
    cloudifyUpload,
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    cloudifyUploadHandler
  );
  const title = formData.get("postTitle") as string;
  const image = formData.get("upload") as string;
  invariant(title, "title must be a value");
  invariant(image, "image must be a value");
  const postData = {
    title,
    image,
    userId,
  };
  await createPost(postData);
  return redirect("/");
};
