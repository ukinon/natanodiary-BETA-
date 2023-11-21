import {
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { auth, db, storage } from "../../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Comment({
  comment,
  commentId,
  originalPostId,
  dbName,
}) {
  const [session] = useAuthState(auth);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, dbName, originalPostId, "comments", commentId, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
    return () => unsubscribe();
  }, [db, originalPostId, commentId]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.uid) !== -1);
  }, [likes]);

  async function likeComment() {
    if (auth.currentUser) {
      const docRef = doc(
        db,
        dbName,
        originalPostId,
        "comments",
        commentId,
        "likes",
        session?.uid
      );
      if (hasLiked) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          username: session?.displayName,
        });
      }
    } else {
      signIn();
    }
  }

  async function deleteComment() {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteDoc(doc(db, dbName, originalPostId, "comments", commentId));

      const likesCollectionRef = collection(
        db,
        dbName,
        originalPostId,
        "comments",
        commentId,
        "likes"
      );
      const likesQuerySnapshot = await getDocs(likesCollectionRef);
      likesQuerySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      if (comment?.image) {
        await deleteObject(ref(storage, `stories/comments/${commentId}/image`));
      }
    }
  }

  return (
    <div className="flex gap-2 sm:mb-3 border-b-2 p-2 pl-5 whitespace-break-spaces cursor-pointer hover:brightness-90 ease-in-out transition-all">
      <img src={comment?.userImg} alt="user" className="h-10 rounded-full" />
      <div className="flex flex-col w-full">
        <div
          className=" flex justify-between w-full"
          onClick={() => router.push(`/posts/${id}`)}
        >
          <div className="flex gap-2 items-center">
            <h4 className="font-bold text-xs lg:text-sm max-w-[139px] overflow-hidden whitespace-nowrap">
              {comment?.name}
            </h4>
            <p className="text-[10px] lg:text-xs">@{comment?.username}</p>
            <span className="text-[10px] lg:text-xs flex flex-row gap-1">
              -<Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-xs lg:text-sm">{comment?.comment}</h3>
          <img
            src={comment?.image}
            alt=""
            className="max-w-screen xl:max-w-xs rounded-xl"
          />
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex flex-row gap-2 items-center">
            {hasLiked ? (
              <SolidHeartIcon
                className="h-7 xl:h-9 text-red-400 hoverEffect"
                onClick={likeComment}
              />
            ) : (
              <HeartIcon
                className="h-7 xl:h-9 hover:text-red-400 hoverEffect"
                onClick={likeComment}
              />
            )}
            {likes.length > 0 && (
              <span className="text-sm -ml-2">{likes.length}</span>
            )}
          </div>
          <div className="">
            {session?.uid === comment?.userId ? (
              <TrashIcon
                className="hoverEffect h-7 xl:h-9 hover:text-red-800"
                onClick={deleteComment}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
