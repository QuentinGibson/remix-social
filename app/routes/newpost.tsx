import { Form, useActionData } from "@remix-run/react";
import { ErrorBoundaryComponent, json } from "@remix-run/server-runtime";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { requireUser } from "~/session.server";
import { MdImage } from "react-icons/md";
import "./newpost.css";
import { useThemeContext } from "~/root";
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
import Toast from "./Toast";
export const loader: LoaderFunction = async ({ request }) => {
  return await requireUser(request);
};

export default function NewPostRoute() {
  const fileRef = useRef<HTMLInputElement>(null);
  const themeContext = useThemeContext();
  const darkMood = themeContext.mood === "dark";
  const actionData = useActionData();
  const handleUpload = useCallback(() => {
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
  let toasts = [];

  if (actionData && !actionData.ok) {
    const message = actionData.message;
    toasts.push(<Toast message={message} />);
  }
  return (
    <main
      className={`${darkMood ? "bg-black" : "bg-white"} pt-36 h-full relative`}
    >
      {toasts}
      <Form
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
            required
            className={`${
              darkMood ? "bg-slate-100" : "bg-slate-200"
            } w-96 rounded-lg  outline-none pl-2 text-base mt-4 leading-loose`}
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
        <div
          style={{ height: 430, width: 580 }}
          className={`${
            darkMood ? "bg-slate-100" : "bg-slate-200"
          } relative flex justify-center items-center cursor-pointer ${
            previewUrl ? "img-preview" : "no-preview"
          }`}
          onClick={handleUpload}
        >
          {!previewUrl && (
            <div className="flex justify-center flex-col items-center">
              <MdImage size="2em" />
              <p className="text-lg">Select a photo to upload</p>
              <button
                style={{ background: themeContext.accent2 }}
                id="upload-button"
                className="px-2 py-2 text-white rounded-lg text-base"
              >
                Choose File
              </button>
            </div>
          )}
          {previewUrl && (
            <img
              className="w-full object-contain h-full"
              src={previewUrl}
              alt="Preview Image"
            />
          )}
        </div>

        <input
          type="file"
          required
          name="upload"
          id="image"
          accept="image/png image/jpeg"
          className="w-1 h-1 hidden"
          onChange={handleChange}
          ref={fileRef}
        />
        <div className="flex justify-start">
          <button
            type="submit"
            id="submit-button"
            className={`${
              darkMood ? "text-white" : "text-black"
            } px-3 py-1 rounded-lg`}
            style={{ background: themeContext.accent }}
          >
            Create Post
          </button>
        </div>
      </Form>
    </main>
  );
}

export const action: ActionFunction = async ({ request }) => {
  console.log(request);
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
    return json({ ok: true, message: "Post created" }, { status: 200 });
  } catch (error: any) {
    return json(
      { ok: false, message: `Post creation failed: ${error.message}` },
      { status: 400 }
    );
  }
};
export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <div>ERROR: There was an issue with your request</div>;
};
