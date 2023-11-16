import React from "react";
import { auth } from "../../../firebase";

export default function ChatBubble({ key, message }) {
  const { text, photoURL, uid } = message.data();

  const sender = uid == auth.currentUser.uid ? true : false;

  return (
    <div
      className={
        sender ? "p-3 flex flex-row-reverse gap-2" : "p-3 flex flex-row gap-2"
      }
    >
      <img src={photoURL} alt="" className="h-10 rounded-full" />
      <p
        className={`${
          sender ? "bg-blue-500 text-white" : "bg-slate-200 text-black"
        } rounded-full p-3 text-xs lg:text-sm`}
      >
        {text}
      </p>
    </div>
  );
}
