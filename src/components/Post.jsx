"use client";

import { FaceSmileIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { sendError } from "next/dist/server/api-utils";
import React, { useRef, useState } from "react";
import { db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function Post() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const imagePickerRef = useRef(null);

  async function sendPost() {
    setIsLoading(true);
    const docRef = await addDoc(collection(db, "stories"), {
      id: session?.user?.uid,
      text: input,
      userImg: session?.user?.image,
      timestamp: serverTimestamp(),
      name: session?.user?.name,
      username: session?.user?.username,
    });
    const imageRef = ref(storage, `stories/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "stories", docRef.id), {
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

  return (
    <div className="flex m-3 gap-2 border-b-2">
      <img
        src={session?.user?.image}
        alt="user"
        className="h-10 rounded-full"
      />
      <div className="w-full ">
        <div>
          <textarea
            rows="2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell our story today"
            className="w-full focus:decoration-current sm:h-28 h-20 resize-none outline-none focus:border-b-2 p-2"
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
                className={`${isLoading && "animate-pulse"}`}
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
                />
              </div>
              <label htmlFor="" className="hoverEffect">
                <FaceSmileIcon className="h-5 w-5  text-blue-500" />
              </label>
            </div>

            <button
              disabled={!input.trim()}
              className="bg-blue-500 rounded-full p-3 text-white text-sm font-bold disabled:opacity-75 w-1/6 hover:brightness-75"
              onClick={sendPost}
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
