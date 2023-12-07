"use client";

import {
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import Moment from "react-moment";
import { auth, db, storage } from "../../../firebase";
import { useEffect, useState } from "react";
import { deleteObject, getMetadata, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { modalState, postIDState } from "@/atom/modalAtom";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithGoogle } from "../layout/SignInButton";

export default function Stories({ post, id, dbName }) {
  const [session] = useAuthState(auth);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postID, setPostID] = useRecoilState(postIDState);

  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, dbName, id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, id]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, dbName, id, "comments"),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.uid) !== -1);
  }, [likes]);

  async function sendNotif(content) {
    const docRef = await addDoc(
      collection(db, "notifications", post.data().userId, "notifications"),
      {
        userPicture: session?.photoURL,
        user: session?.displayName,
        userId: session?.uid,
        content: content,
        timestamp: serverTimestamp(),
        text: post.data().text,
        postId: id,
        postUserImage: post?.data()?.userImg,
        isRead: false,
      }
    );
  }

  async function deleteNotif() {
    // Create a query with the specified condition
    const q = query(
      collection(db, "notifications", post.data().userId, "notifications"),
      where("postId", "==", id),
      where("userId", "==", session?.uid)
    );

    // Get the documents that match the condition
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);

    // Iterate through the documents and delete each one
    querySnapshot.forEach(async (document) => {
      try {
        // Delete the document
        await deleteDoc(
          doc(
            db,
            "notifications",
            post.data().userId,
            "notifications",
            document.id
          )
        );
        console.log("Document deleted successfully:", document.id);
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    });
  }

  async function likePost() {
    if (auth.currentUser) {
      const docRef = doc(db, dbName, id, "likes", session?.uid);
      if (hasLiked) {
        await deleteDoc(docRef);
        deleteNotif();
      } else {
        await setDoc(docRef, {
          email: session.email,
        });
        if (post.data().userId != session.uid) {
          sendNotif(`${session?.displayName} liked your post`);
        }
      }
    } else {
      signInWithGoogle;
    }
  }

  async function deletePost() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, dbName, id));
      const commentsCollectionRef = collection(db, dbName, id, "comments");
      const commentsQuerySnapshot = await getDocs(commentsCollectionRef);
      commentsQuerySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Delete the subcollection "likes"
      const likesCollectionRef = collection(db, dbName, id, "likes");
      const likesQuerySnapshot = await getDocs(likesCollectionRef);
      likesQuerySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      if (post?.data()?.image) {
        await deleteObject(ref(storage, `${dbName}/${id}/image`));
      }
      if (dbName === "diary") {
        router.push("/diary");
      } else {
        router.push("/");
      }
    }
  }

  return (
    <div className="flex gap-2 mb-3 border-b-2 border-gray-100 p-3 whitespace-break-spaces cursor-pointer hover:brightness-90 ease-in-out transition-all">
      <img
        src={post?.data()?.userImg}
        alt="user"
        className="h-10 rounded-full"
      />
      <div className="flex flex-col w-full">
        <div
          className=" flex justify-between w-full"
          onClick={() => router.push(`posts/${id}/${dbName}`)}
        >
          <div className="flex gap-2 items-center">
            <h4 className="font-bold text-xs lg:text-sm max-w-[100px] lg:max-w-[180px] overflow-hidden whitespace-nowrap">
              {post?.data()?.name}
            </h4>
            <p className="text-[10px] max-w-[100px] overflow-hidden lg:max-w-none lg:text-xs">
              @{post?.data()?.email}
            </p>
            <span className="text-[10px] lg:text-xs flex flex-row gap-1">
              -<Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-xs xl:text-sm">{post?.data()?.text}</h3>
          <img
            src={post?.data()?.image}
            alt=""
            className="max-w-screen xl:max-w-xs rounded-xl"
          />
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex flex-row gap-2 items-center">
            <ChatBubbleOvalLeftEllipsisIcon
              className="h-7 xl:h-9 hoverEffect"
              onClick={() => {
                if (!auth.currentUser) {
                  signIn();
                }
                setPostID(id);
                setOpen(!open);
              }}
            />
            {comments.length > 0 && (
              <span className="text-sm -ml-2">{comments.length}</span>
            )}
          </div>
          <div className="flex flex-row gap-2 items-center">
            {hasLiked ? (
              <SolidHeartIcon
                className="h-7 xl:h-9 text-red-400 hoverEffect"
                onClick={likePost}
              />
            ) : (
              <HeartIcon
                className="h-7 xl:h-9 hover:text-red-400 hoverEffect"
                onClick={likePost}
              />
            )}
            {likes.length > 0 && (
              <span className="text-sm -ml-2">{likes.length}</span>
            )}
          </div>
          {session?.uid === post?.data()?.userId ? (
            <TrashIcon
              className="hoverEffect h-7 xl:h-9 hover:text-red-800"
              onClick={deletePost}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
