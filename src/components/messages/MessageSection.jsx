"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Stories from "../feeds/Stories";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Chats from "./Chats";

export default function MessageSection() {
  const router = useRouter();
  const [session] = useAuthState(auth);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (session) {
      const unsubscribe = onSnapshot(
        collection(db, "messages", session?.uid, "message_list"),
        (snapshot) => setChats(snapshot.docs)
      );
      return () => unsubscribe();
    }
  }, [db, session]);

  return (
    <div className="xl:ml-[300px] mb-12 sm:mb-0 xl:min-w-[650px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-100 flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky items-center border-b-2 border-gray-100 justify-between bg-white top-0 z-50">
        <div className="flex flex-row gap-2 items-center">
          <ArrowLeftIcon
            className="h-10 hoverEffect"
            onClick={() => router.push("/")}
          />
          <h2 className="text-lg font-semibold cursor-pointer">Messages</h2>
        </div>
      </div>

      {chats.map((chat) => (
        <Chats key={chat.id} id={chat.id} />
      ))}
    </div>
  );
}
