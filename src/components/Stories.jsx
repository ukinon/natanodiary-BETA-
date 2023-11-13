"use client";

import { TrashIcon } from "@heroicons/react/20/solid";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import Moment from "react-moment";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

export default function Stories({ post }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const unsubscribet = onSnapshot(
      collection(db, "stories", post.id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  async function likePost() {
    if (session) {
      const docRef = doc(db, "stories", post.id, "likes", session?.user.uid);
      if (hasLiked) {
        console.log("Before deleteDoc");
        await deleteDoc(docRef);
        console.log("After deleteDoc");
      } else {
        await setDoc(docRef, {
          username: session.user.username,
        });
      }
    } else {
      signIn();
    }
  }

  return (
    <div className="flex gap-2 mb-3 border-b-2 p-3">
      <img src={post.data().userImg} alt="user" className="h-10 rounded-full" />
      <div className="flex flex-col w-full">
        <div className=" flex justify-between ">
          <div className="flex gap-2 items-center">
            <h4 className="font-bold text-sm max-w-[139px] overflow-hidden whitespace-nowrap">
              {post.data().name}
            </h4>
            <p className="text-xs">@{post.data().username}</p>
            <span className="text-xs">
              <Moment fromNow>{post.data().timestamp?.toDate()}</Moment>
            </span>
          </div>

          <TrashIcon className="hoverEffect h-8" />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm">{post.data().text}</h3>
          <img src={post.data().image} alt="" className="max-w-sm rounded-xl" />
        </div>
        <div className="flex flex-row ">
          <ChatBubbleOvalLeftEllipsisIcon className="h-9 hoverEffect" />
          <div className="flex flex-row gap-1 items-center">
            {hasLiked ? (
              <SolidHeartIcon
                className="h-9 text-red-400 hoverEffect"
                onClick={likePost}
              />
            ) : (
              <HeartIcon
                className="h-9 hover:text-red-400 hoverEffect"
                onClick={likePost}
              />
            )}
            {likes.length > 0 && (
              <span className="text-sm -ml-2">{likes.length}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
