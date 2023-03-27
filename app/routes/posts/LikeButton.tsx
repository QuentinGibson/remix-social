import React, { useState } from "react";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";

const LikeButton = ({ like, likeHandler, unlikeHandler, count }: any) => {
  return (
    <div className="mb-2 flex">
      <button
        className="text-lg mr-2"
        onClick={like ? unlikeHandler : likeHandler}
      >
        {like ? <RiHeartFill /> : <RiHeartLine />}
      </button>
      <p className="font-semibold">{count}</p>
    </div>
  );
};

export default LikeButton;
