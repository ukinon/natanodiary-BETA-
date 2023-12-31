import React from "react";
import { auth } from "../../../firebase";

export default function TypingBubble({ photoURL, uid }) {
  console.log(uid);
  const sender = uid == auth.currentUser.uid ? true : false;

  return (
    <div className={sender ? "hidden" : "p-3 flex flex-row gap-2"}>
      <img src={photoURL} alt="" className="h-10 rounded-full" />
      <p
        className={
          "bg-slate-200 text-black rounded-full p-3 text-xs lg:text-sm font-semibold italic"
        }
      >
        Typing...
      </p>
    </div>
  );
}
