import { Form } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { requireUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await requireUser(request);
};

export default function NewPostRoute() {
  return (
    <Form
      method="post"
      action={`/api/storage/upload`}
      className="gap-8 flex flex-col max-w-4xl w-full mx-auto mt-10"
      encType="multipart/form-data"
    >
      <p>
        <label htmlFor="title">
          Post Title:
          <input
            id="title"
            className="w-full rounded border border-gray-500 px-2 py-2 text-lg leading-loose"
            name="postTitle"
            type="text"
          />
        </label>
      </p>
      <label htmlFor="image">Image: </label>
      <input type="file" name="upload" id="image" />
      <input type="submit" value="Create Post" />
    </Form>
  );
}
