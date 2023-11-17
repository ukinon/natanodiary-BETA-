import React from "react";
import { auth } from "../../../firebase";
import Moment from "react-moment";

export default function ChatBubble({ message }) {
  const { text, photoURL, uid, timestamp } = message.data();

  const sender = uid == auth.currentUser.uid ? true : false;

  return (
    <div
      className={
        sender
          ? "p-3 flex flex-row-reverse gap-2 items-center"
          : "p-3 flex flex-row gap-2 items-center"
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
      <div className="flex flex-col justify-end items-end h-6">
        <Moment fromNow className="text-[8px]">
          {timestamp?.toDate()}
        </Moment>
      </div>
    </div>
  );
}
