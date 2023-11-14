"use client";

import { FaceSmileIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { sendError } from "next/dist/server/api-utils";
import React, { useRef, useState } from "react";
import { db, storage } from "../../../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import EmojiPicker from "emoji-picker-react";
import ReactModal from "react-modal";

export default function Post() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const imagePickerRef = useRef(null);
  const [emojiPicker, setEmojiPicker] = useState(false);

  async function sendPost() {
    setIsLoading(true);
    const docRef = await addDoc(collection(db, "stories"), {
      id: session?.user?.uid,
      text: input,
      userImg: session?.user?.image,
      timestamp: serverTimestamp(),
      name: session?.user?.name,
      username: session?.user?.username,
      userId: session?.user.uid,
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
    session && (
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
                    accept="image/png, image/gif, image/jpeg"
                  />
                </div>
                <label htmlFor="" className="hoverEffect">
                  <FaceSmileIcon
                    className="h-5 w-5  text-blue-500"
                    onClick={() => setEmojiPicker((prev) => !prev)}
                  />
                </label>
                {emojiPicker && (
                  <ReactModal
                    isOpen={open}
                    onRequestClose={() => setEmojiPicker(false)}
                    className="max-w-lg w-[60%] h-[20px] absolute top-24 left-[50%] translate-x-[-50%] bg-white rounded-xl shadow-md border-2 border-gray-200"
                  >
                    <EmojiPicker
                      searchDisabled="false"
                      previewConfig={{ showPreview: true }}
                      emojiStyle="google"
                      onEmojiClick={(e) => setInput((input) => input + e.emoji)}
                      height={400}
                      width="100%"
                    />
                  </ReactModal>
                )}
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
    )
  );
}
