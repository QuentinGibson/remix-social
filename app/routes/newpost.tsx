import { Form } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { requireUser } from "~/session.server";
import { MdImage } from "react-icons/md";
import "./newpost.css";
import { useThemeContext } from "~/root";

export const loader: LoaderFunction = async ({ request }) => {
  return await requireUser(request);
};

export default function NewPostRoute() {
  const fileRef = useRef<HTMLInputElement>(null);
  const themeContext = useThemeContext();
  const darkMood = themeContext.mood === "dark";
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
  return (
    <main className={`${darkMood ? "bg-black" : "bg-white"} pt-36 h-full`}>
      <Form
        method="post"
        action={`/api/storage/upload`}
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
          name="upload"
          id="image"
          className="w-1 h-1 hidden"
          onChange={handleChange}
          ref={fileRef}
        />
        <div className="flex justify-start">
          <button
            type="submit"
            className={`${
              darkMood ? "text-white" : "text-black"
            } px-3 py-1 rounded-lg text-white`}
            style={{ background: themeContext.accent }}
          >
            Create Post
          </button>
        </div>
      </Form>
    </main>
  );
}
