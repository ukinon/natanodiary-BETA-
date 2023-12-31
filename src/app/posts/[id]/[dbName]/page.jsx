"use client";
import CommentsModal from "@/components/feeds/CommentsModal";
import Feed from "@/components/feeds/Feed";
import Post from "@/components/feeds/Post";
import Sidebar from "@/components/layout/Sidebar";
import Stories from "@/components/feeds/Stories";
import Widget from "@/components/widget/Widget";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import {
  FaceSmileIcon,
  HeartIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../../../../../firebase";
import Comment from "@/components/feeds/Comment";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import BottomNav from "@/components/layout/BottomNav";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();

  const [session] = useAuthState(auth);
  const id = params.id;
  const dbName = params.dbName;

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const imagePickerRef = useRef(null);

  useEffect(
    () => onSnapshot(doc(db, dbName, id), (snapshot) => setPost(snapshot)),
    [db, id]
  );

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, dbName, id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, id]);

  async function sendComment() {
    setIsLoading(true);

    const docRef = await addDoc(collection(db, dbName, id, "comments"), {
      comment: input,
      name: session?.displayName,
      email: session?.email,
      userImg: session?.photoURL,
      timestamp: serverTimestamp(),
      userId: session?.uid,
    });
    const imageRef = ref(storage, `stories/comments/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, dbName, id, "comments", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setIsLoading(false);
  }

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  async function deletePost() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, dbName, id));

      // Delete the subcollection "comments"
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
        await deleteObject(ref(storage, `stories/${id}/image`));
      }
      router.push("/");
    }
  }

  return (
    <main className="flex min-h-screen max-w-7xl mx-auto">
      <Sidebar page="home" />
      <BottomNav page="home" />
      <div className="xl:ml-[150px] xl:min-w-[650px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-100 flex-grow max-w-xl">
        <div className="flex py-2 px-3 sticky items-center border-b-2 justify-between bg-white top-0 z-50">
          <div className="flex flex-row gap-2 items-center">
            <ArrowLeftIcon
              className="h-10 hoverEffect"
              onClick={() => router.push("/")}
            />
            <h2 className="text-lg font-semibold cursor-pointer">Post</h2>
          </div>
        </div>
        <Stories id={id} post={post} dbName="stories" />

        <div className="flex p-2 sm:mb-3 gap-2 border-b-2">
          <img
            src={session?.photoURL}
            alt="user"
            className="h-11 rounded-full"
          />
          <div className="w-full ">
            <div>
              <textarea
                rows="2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your reply"
                className="w-full focus:decoration-current h-20 resize-none outline-none focus:border-b-2 p-2"
              ></textarea>

              {selectedFile && (
                <div className="mb-3">
                  <XMarkIcon
                    className="h-7 text-black absolute cursor-pointer"
                    onClick={() => setSelectedFile(null)}
                  />
                  <img
                    src={selectedFile}
                    alt=""
                    className={`${isLoading && "animate-pulse"} max-w-[250px]`}
                  />
                </div>
              )}
            </div>
            {!isLoading && (
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-3">
                  <div
                    className="hoverEffect"
                    onClick={() => imagePickerRef.current.click()}
                  >
                    <PhotoIcon className="h-5 w-5 text-blue-500" />
                    <input
                      type="file"
                      hidden
                      ref={imagePickerRef}
                      onChange={addImageToPost}
                      accept="image/png, image/gif, image/jpeg"
                    />
                  </div>
                  <label htmlFor="" className="hoverEffect">
                    <FaceSmileIcon className="h-5 w-5  text-blue-500" />
                  </label>
                </div>

                <button
                  disabled={!input.trim()}
                  className="bg-blue-500 rounded-full p-3 text-white text-sm font-bold disabled:opacity-75 w-fit hover:brightness-75"
                  onClick={sendComment}
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mb-16 sm:mb-0">
          {comments.map((comment) => {
            return (
              <Comment
                commentId={comment.id}
                comment={comment.data()}
                originalPostId={id}
                dbName={dbName}
                key={comment.id}
              />
            );
          })}
        </div>
      </div>
      <Widget />
      <CommentsModal dbName="diary" />
    </main>
  );
}
