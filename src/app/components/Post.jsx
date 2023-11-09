import { FaceSmileIcon, PhotoIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function Post() {
  return (
    <div className="flex m-3 gap-2 border-b-2">
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="user"
        className="h-10"
      />
      <div className="w-full ">
        <div>
          <textarea
            rows="2"
            placeholder="Tell our story today"
            className="w-full focus:decoration-current sm:h-28 h-20 resize-none outline-none focus:border-b-2 p-2"
          ></textarea>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-3">
            <PhotoIcon className="h-5 w-5 text-blue-500" />
            <FaceSmileIcon className="h-5 w-5  text-blue-500" />
          </div>
          <button className="bg-blue-500 rounded-full p-3 text-white text-xs font-bold">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
