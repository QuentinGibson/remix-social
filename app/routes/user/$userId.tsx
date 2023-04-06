import { ErrorBoundaryComponent, json, LoaderArgs } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getUserProfileById } from "~/models/user.server";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TimeAgo from "react-timeago";
import { useThemeContext } from "~/root";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.userId, "postId not found");
  const user = await getUserProfileById(params.userId);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ user });
}

export default function UserRoute() {
  const { user } = useLoaderData<typeof loader>();
  const [value, setValue] = React.useState(0);
  const themeContext = useThemeContext();
  const darkMood = themeContext.mood === "dark";

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const CommentHistory = () => {
    return (
      <>
        {user.comments.map((comment) => {
          return (
            <Link
              className="block border-b-2 border-solid border-slate-100 py-5 text-base hover:bg-slate-100"
              key={comment.id}
              to={`/posts/${comment.postId}`}
            >
              <span>{comment.body}</span>
            </Link>
          );
        })}
      </>
    );
  };

  const PostHistory = () => {
    return (
      <>
        {user.posts.map((post) => {
          return (
            <Link
              className="block border-b-2 border-solid border-slate-100 py-5 text-base hover:bg-slate-100"
              key={post.id}
              to={`/posts/${post.id}`}
            >
              <span className="font-semibold">
                {post.title} - <TimeAgo date={post.createdAt} />
              </span>
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <main className={`${darkMood ? "bg-black" : "bg-white"} pb-8 pt-36`}>
      <div className="mx-auto max-w-screen-md p-4 pt-10" id="container">
        <div className="mb-8 flex items-center">
          <div className="mr-10 w-16">
            <img
              id="user-avatar"
              src={user.avatar}
              alt="Avatar"
              className="rounded-full"
            />
          </div>
          <div>
            <h1
              id="user-name"
              className={`${
                darkMood ? "text-white" : "text-black"
              } text-lg font-bold`}
            >
              {user.name}
            </h1>
            <div className="flex">
              <div className="mr-8">
                <p
                  style={{ color: themeContext.accent }}
                  className="total-label font-bold text-cyan-900"
                >
                  Posts
                </p>
                <p className={`${darkMood ? "text-white" : "text-black"}`}>
                  {user.posts.length}
                </p>
              </div>
              <div>
                <p
                  style={{ color: themeContext.accent }}
                  className="total-label font-bold text-cyan-900"
                >
                  Comments
                </p>
                <p className={`${darkMood ? "text-white" : "text-black"}`}>
                  {user.comments.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="A history of posts and comments from this user"
              >
                <Tab label="Posts" {...a11yProps(0)} />
                <Tab label="Comments" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <div className="pr-16">
              <TabPanel value={value} index={0}>
                <PostHistory />
              </TabPanel>
            </div>
            <TabPanel value={value} index={1}>
              <CommentHistory />
            </TabPanel>
          </Box>
        </div>
      </div>
    </main>
  );
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div className="pt-36">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-12 flex flex-col items-center justify-center font-bold">
          <h1 className="mb-4 text-3xl">We're Sorry!</h1>
          <p className="text-xl">
            It seem like getting your request failed with the error below!
          </p>
        </div>
        <div className="flex h-24 flex-col items-center justify-center rounded bg-red-800 px-8 py-4 text-white">
          Error Message:
          <span className="mt-2 text-base">{error.message}</span>
        </div>
      </div>
    </div>
  );
};
