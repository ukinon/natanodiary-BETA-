"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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
import { selectedChatState, userChatState } from "@/atom/chatAtom";

export default function MessageRoom() {
  const router = useRouter();
  const [session] = useAuthState(auth);
  const [formValue, setFormValue] = useState("");
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [userChat, setUserChat] = useRecoilState(userChatState);
  const [messages, setMessages] = useState([]);
  const [isTexting, setIsTexting] = useState([]);
  const [latestChat, setLatestChat] = useState("");
  let formRef = useRef();
  const dummy = useRef();
  const chatDiv = useRef();

  useEffect(() => {
    if (session) {
      if (selectedChat != "hi") {
        setIsLoading(true);
        const unsubscribe = onSnapshot(
          query(
            collection(db, "chats", selectedChat, "messages"),
            orderBy("timestamp", "asc")
          ),
          (snapshot) => setMessages(snapshot.docs)
        );

        setIsLoading(false);

        return () => unsubscribe();
      }
    }
  }, [db, session, selectedChat]);

  useEffect(() => {
    const lastChildElement = dummy.current;
    lastChildElement?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (session) {
      if (selectedChat != "hi") {
        setIsLoading(true);
        const unsubscribe = onSnapshot(
          query(
            collection(db, "chats", selectedChat, "is_typing"),
            where("uid", "!=", session?.uid)
          ),
          (snapshot) => setIsTexting(snapshot.docs)
        );
        setIsLoading(false);
        return () => unsubscribe();
      }
    }
  }, [db, formValue]);

  useEffect(() => {
    window.addEventListener("beforeunload", deleteTyping);
  }, [session]);

  async function sendMessage(e) {
    e.preventDefault();
    await addDoc(collection(db, "chats", selectedChat, "messages"), {
      text: formValue,
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      timestamp: serverTimestamp(),
    });

    await updateDoc(doc(db, "chats", selectedChat), {
      latestMessage: formValue,
    });
    setFormValue("");
  }

  function deleteTyping() {
    if (session) {
      deleteDoc(
        doc(db, "chats", selectedChat, "is_typing", auth.currentUser.uid)
      );
      setIsTexting([]);
    }
  }

  function isTyping(e) {
    if (e != "") {
      setDoc(
        doc(db, "chats", selectedChat, "is_typing", auth.currentUser.uid),
        {
          uid: auth.currentUser.uid,
          photoURL: auth.currentUser.photoURL,
        }
      );
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

  function resizeInput(el) {
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  }

  const handleInputChange = (e) => {
    setFormValue(e.target.value),
      isTyping(e.target.value),
      resizeInput(e.target);
  };

  if (selectedChat != "hi") {
    return (
      <div className="mb-0 xl:w-[400px] xl:mr-[100px] border border-l-2 border-r-2 border-gray-100 flex-grow max-w-xl">
        <div className="flex py-2 px-3 sticky items-center border-b-2 border-gray-100 justify-between bg-white top-0 z-50">
          <div className="flex flex-row gap-2 items-center">
            <ArrowLeftIcon
              className="h-7 hoverEffect xl:hidden"
              onClick={() => router.back()}
            />
            <div className="flex flex-row gap-2 items-center">
              {session && (
                <>
                  <img src={userChat.photoURL} className="h-10 rounded-full" />
                  <h2 className="font-semibold">{userChat.displayName}</h2>
                </>
              )}
            </div>
          </div>
        </div>
        <main className="h-[80vh] xl:h-[78vh] overflow-y-scroll" ref={chatDiv}>
          {isLoading && <h1 className="text-center text-4xl">Loading...</h1>}
          <AnimatePresence>
            {!isLoading &&
              messages &&
              session &&
              selectedChat != "hi" &&
              messages.map((message) => (
                <>
                  <motion.div
                    key={message.data().uid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ChatBubble message={message} key={message.id} />
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
            <span ref={dummy}></span>
          </AnimatePresence>
        </main>

        <div className="flex items-center bg-white sticky h-fit p-4 bottom-0 mb-0 border-t-2">
          <form
            action=""
            className="flex flex-row items-center justify-between px-5 py-2 bg-gray-200 rounded-full sm:rounded-xl text-black w-full"
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
              className="input w-[70%] max-h-16 lg:max-h-32 bg-transparent outline-none text-black placeholder:text-black placeholder:text-xs resize-none text-xs lg:text-sm lg:placeholder:text-sm border-none h-5"
              onKeyDown={onEnterPress}
              placeholder="Type your message here"
            />

            <button
              type="submit"
              className="bg-transparent text-white disabled:opacity-50"
              disabled={!formValue.trim()}
            >
              <ChevronRightIcon className="h-8 text-blue-500" />
            </button>
          </form>
        </div>
      </div>
    );
  } else {
    return <h1>hi</h1>;
  }
}
