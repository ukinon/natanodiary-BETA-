"use client";

import { modalState, postIDState } from "@/atom/modalAtom";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import ReactModal from "react-modal";
import { useRecoilState } from "recoil";
import { db, storage } from "../../../firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Moment from "react-moment";
import { useSession } from "next-auth/react";
import { PhotoIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function CommentsModal() {
  const [open, setOpen] = useRecoilState(modalState);
  const [postID] = useRecoilState(postIDState);
  const [post, setPost] = useState({});
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const imagePickerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    onSnapshot(doc(db, "stories", postID), (snapshot) => {
      setPost(snapshot);
    });
  }, [postID, db]);

  async function sendComment() {
    setIsLoading(true);

    const docRef = await addDoc(collection(db, "stories", postID, "comments"), {
      comment: input,
      name: session?.user.name,
      username: session?.user.username,
      userImg: session?.user.image,
      timestamp: serverTimestamp(),
      userId: session?.user.uid,
    });
    const imageRef = ref(storage, `stories/comments/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "stories", postID, "comments", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setIsLoading(false);
    setOpen(false);
    router.push(`/posts/${postID}`);
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
  return (
    <div>
      {open && (
        <ReactModal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className="max-w-lg w-[90%] min-h-[300px] absolute top-24 left-[50%] translate-x-[-50%] bg-white rounded-xl shadow-md border-2 border-gray-200"
        >
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <div
                onClick={() => setOpen(false)}
                className="hoverEffect w-9 h-9 flex items-center justify-center"
              >
                <XMarkIcon className="h-10 text-gray-800" />
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center p-2 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-7 top-11  bg-gray-300"></span>
              <img
                src={post?.data()?.userImg}
                alt="user"
                className="rounded-full h-11"
              />
              <h1 className="font-bold text-xs xl:text-base">
                {post?.data()?.name}
              </h1>
              <span className="text-[7px] lg:text-xs">
                @{post?.data()?.username}
              </span>
              <span className="text-[7px] lg:text-xs">-</span>
              <span className="text-[7px] lg:text-xs">
                {" "}
                <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
              </span>
            </div>
            <p className="text-sm ml-16 mb-3">{post?.data()?.text}</p>
            <div className="flex p-2 gap-2 border-b-2">
              <img
                src={session?.user?.image}
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
                    className="w-full focus:decoration-current sm:h-28 h-20 resize-none outline-none focus:border-b-2 p-2 text-xs xl:text-sm"
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
                        className={`${
                          isLoading && "animate-pulse"
                        } max-w-[250px]`}
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
          </div>
        </ReactModal>
      )}
    </div>
  );
}
