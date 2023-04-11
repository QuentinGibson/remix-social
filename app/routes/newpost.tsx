/**
 * This is a TypeScript component that renders a form for creating a new post, including a file upload input, image preview, and loading indicators.
 */
import { useFetcher } from "@remix-run/react";
import { ErrorBoundaryComponent, json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { requireUser } from "~/session.server";
import { MdImage } from "react-icons/md";
import { useThemeContext, useToast } from "~/root";
import { ActionFunction, LoaderFunction, UploadHandler } from "@remix-run/node";
import {
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import { uploadImage } from "~/uploader-handler.server";
import { requireUserId } from "~/session.server";
import { createPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import { canBeOptimistic } from "~/utils";
export const loader: LoaderFunction = async ({ request }) => {
  return await requireUser(request);
};

export const meta = () => ([{ title: "New Post" }]);

export default function NewPostRoute() {
  const fileRef = useRef<HTMLInputElement>(null);
  const themeContext = useThemeContext();
  const darkMood = themeContext.mood === "dark";
  const handleUpload = useCallback((e: any) => {
    e.preventDefault();
    fileRef.current?.click();
  }, []);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const newPostFetcher = useFetcher();
  const isLoading = canBeOptimistic(newPostFetcher);
  const { showToast } = useToast();

  useEffect(() => {
    if (isLoading) {
      if (newPostFetcher.data) {
        if (!newPostFetcher.data.ok) {
          showToast(newPostFetcher.data.message, true);
        }
      }
    }
  }, [newPostFetcher]);

  return (
    <main
      className={`${darkMood ? "bg-black" : "bg-white"} pt-36 h-full relative`}
    >
      <newPostFetcher.Form
        method="post"
        className={` gap-8 flex flex-col max-w-4xl w-full mx-auto`}
        encType="multipart/form-data"
      >
        <p>
          <label
            className={`${darkMood ? "text-white" : "text-black"} text-2xl`}
            htmlFor="title"
          >
            Post Title
          </label>
          <br />
          <input
            id="title"
            disabled={isLoading}
            required
            className={`${darkMood ? "bg-slate-100" : "bg-slate-200"
              } w-96 rounded-lg  outline-none pl-2 text-base mt-4 leading-loose disabled:opacity-50`}
            name="postTitle"
            type="text"
          />
        </p>
        <label
          className={`${darkMood ? "text-white" : "text-black"} text-2xl`}
          htmlFor="image"
        >
          Image
        </label>
        <button
          style={{ height: 430, width: 580 }}
          className={`${darkMood ? "bg-slate-100" : "bg-slate-200"
            } relative flex justify-center items-center cursor-pointer ${previewUrl ? "img-preview" : "no-preview"
            }`}
          disabled={isLoading}
          onClick={handleUpload}
        >
          {!previewUrl && (
            <div className="flex flex-col items-center justify-center">
              <MdImage size="2em" />
              <p className="text-lg">Select a photo to upload</p>
              <button
                style={{ background: themeContext.accent2 }}
                id="upload-button"
                disabled={isLoading}
                className="px-2 py-2 text-base text-white rounded-lg disabled:opacity-50"
              >
                Choose File
              </button>
            </div>
          )}
          {previewUrl && (
            <img
              className="object-contain w-full h-full"
              src={previewUrl}
              alt="Preview Image"
            />
          )}
        </button>

        <input
          type="file"
          required
          name="upload"
          id="image"
          accept="image/png image/jpeg"
          className="hidden w-1 h-1"
          onChange={handleChange}
          ref={fileRef}
        />
        <div className="flex justify-start">
          <button
            type="submit"
            id="submit-button"
            disabled={isLoading}
            className={`${darkMood ? "text-white" : "text-black"
              } px-3 py-1 rounded-lg disabled:opacity-50`}
            style={{ background: themeContext.accent }}
          >
            {isLoading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </newPostFetcher.Form>
    </main>
  );
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const userId = await requireUserId(request);
    const cloudifyUpload: UploadHandler = async ({ name, data, filename }) => {
      if (name !== "upload") {
        return undefined;
      }
      if (!filename || filename.length === 0) {
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
    const title = formData.get("postTitle");
    const image = formData.get("upload");
    invariant(typeof title === "string", "title must be a value");
    invariant(typeof image === "string", "image must be a value");
    if (image.length === 0) {
      throw Error("There is no image");
    }
    const postData = {
      title,
      image,
      userId,
    };
    await createPost(postData);
    return redirect("/", { status: 200 });
  } catch (error: any) {
    return json(
      { ok: false, message: `Post creation failed: ${error.message}` },
      { status: 400 }
    );
  }
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div className="pt-36">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-12 font-bold">
          <h1 className="mb-4 text-3xl">We're Sorry!</h1>
          <p className="text-xl">
            It seem like getting your request failed with the error below!
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-24 px-8 py-4 text-white bg-red-800 rounded">
          Error Message:
          <span className="mt-2 text-base">{error.message}</span>
        </div>
      </div>
    </div>
  );
};
