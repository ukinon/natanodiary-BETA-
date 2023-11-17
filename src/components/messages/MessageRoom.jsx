"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Stories from "../feeds/Stories";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatBubble from "./ChatBubble";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  FaceSmileIcon,
  PhotoIcon,
} from "@heroicons/react/20/solid";
import { useRecoilState } from "recoil";
import { loadingState } from "@/atom/loadingAtom";
import TypingBubble from "./TypingBubble";

export default function MessageRoom() {
  const params = useParams();
  const router = useRouter();
  const [session] = useAuthState(auth);
  const [formValue, setFormValue] = useState("");
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const [messages, setMessages] = useState([]);
  const [isTexting, setIsTexting] = useState([]);
  let formRef = useRef();
  const dummy = useRef();

  useEffect(() => {
    if (session) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(
        query(collection(db, "messages"), orderBy("timestamp", "asc")),
        (snapshot) => setMessages(snapshot.docs)
      );
      setIsLoading(false);
      const lastChildElement = dummy.current.lastElementChild;
      lastChildElement?.scrollIntoView({ behavior: "smooth" });
      return () => unsubscribe();
    }
  }, [db, session]);

  useEffect(() => {
    if (session) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(
        query(collection(db, "is_typing"), where("uid", "!=", session?.uid)),
        (snapshot) => setIsTexting(snapshot.docs)
      );
      setIsLoading(false);
      return () => unsubscribe();
    }
  }, [db, formValue]);

  useEffect(() => {
    window.addEventListener("beforeunload", deleteTyping);
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [session]);

  console.log(isTexting);

  async function sendMessage(e) {
    e.preventDefault();
    await addDoc(collection(db, "messages"), {
      text: formValue,
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      timestamp: serverTimestamp(),
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }

  function deleteTyping() {
    if (session) {
      deleteDoc(doc(db, "is_typing", auth.currentUser.uid));
      setIsTexting([]);
    }
  }

  function isTyping(e) {
    if (e != "") {
      setDoc(doc(db, "is_typing", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL,
      });
    } else {
      deleteTyping();
    }
  }

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      formRef.requestSubmit();
    }
  };

  const handleInputChange = (e) => {
    setFormValue(e.target.value), isTyping(e.target.value);
  };

  return (
    <div className="xl:ml-[300px] mb-0 xl:min-w-[650px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-100 flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky items-center border-b-2 border-gray-100 justify-between bg-white top-0 z-50">
        <div className="flex flex-row gap-2 items-center">
          <ArrowLeftIcon
            className="h-10 hoverEffect"
            onClick={() => router.push("/")}
          />
          <h2 className="text-lg font-semibold cursor-pointer">Chat</h2>
        </div>
      </div>
      <div className="min-h-[80%] xl:min-h-screen ">
        <AnimatePresence>
          {!isLoading &&
            messages &&
            session?.uid &&
            messages.map((message) => (
              <>
                <motion.div
                  key={message.uid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ChatBubble
                    message={message}
                    key={message.id}
                    timestamp={message.timestamp}
                  />
                </motion.div>
              </>
            ))}
          {!isLoading &&
            isTexting &&
            isTexting.map((message) => (
              <>
                <motion.div
                  key={message.uid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TypingBubble
                    uid={message.data().uid}
                    photoURL={message.data().photoURL}
                  />
                </motion.div>
              </>
            ))}

          {isLoading && (
            <p className="min-h-screen" key={session?.uid}>
              {" "}
              Loading ...
            </p>
          )}
          <div className="fixed bottom-0" ref={dummy}></div>
        </AnimatePresence>
      </div>
      <div className="flex items-center bg-white sticky p-4 pb-8 bottom-0 mb-0 border-t-2">
        <form
          action=""
          className="flex flex-row justify-between px-5 py-2 bg-gray-300 rounded-full sm:rounded-xl text-black w-full"
          onSubmit={sendMessage}
          ref={(el) => (formRef = el)}
        >
          <div className="flex flex-row gap-3 items-center">
            {" "}
            <PhotoIcon className="h-5 w-5 text-blue-500" />
            <input
              type="file"
              hidden
              accept="image/png, image/gif, image/jpeg"
            />
            <FaceSmileIcon
              className="h-5 w-5  text-blue-500"
              onClick={() => setEmojiPicker((prev) => !prev)}
            />
          </div>

          <textarea
            value={formValue}
            onChange={handleInputChange}
            className="w-[70%] bg-transparent border-none outline-none text-black placeholder:text-black resize-none h-7 pt-1"
            placeholder="Type Your Message Here"
            onKeyDown={onEnterPress}
          />

          <button type="submit" className="bg-transparent text-white">
            <ChevronRightIcon className="h-8 text-blue-500" />
          </button>
        </form>
      </div>
    </div>
  );
}
