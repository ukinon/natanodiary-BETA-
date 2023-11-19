"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Stories from "../feeds/Stories";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Profile() {
  const router = useRouter();
  const [session] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getData() {
      if (session?.uid) {
        const unsubscribe = onSnapshot(
          query(
            collection(db, "stories"),
            orderBy("timestamp", "desc"),
            where("userId", "==", session?.uid)
          ),
          (snapshot) => {
            setPosts(snapshot.docs);
          }
        );
        return () => unsubscribe();
      }
    }
    getData();
  }, [session]);

  return (
    <div className="xl:ml-[150px] mb-12 sm:mb-0 xl:min-w-[650px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-100 flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky items-center border-b-2 border-gray-100 justify-between bg-white top-0 z-50">
        <div className="flex flex-row gap-2 items-center">
          <ArrowLeftIcon
            className="h-7 hoverEffect"
            onClick={() => router.push("/")}
          />
          <h2 className="text-lg font-semibold cursor-pointer">Profile</h2>
        </div>
      </div>

      <div className="flex flex-col border-b-2 border-gray-100">
        <div className="h-32 border-b-2 border-gray-300 bg-black"></div>

        <div className="flex flex-row justify-between">
          <div className="p-5 -mt-16">
            <img
              src={session?.photoURL}
              alt=""
              className="rounded-full h-24 border-2 border-black"
              onClick={() => {
                auth.signOut();
                redirect("/");
              }}
            />
          </div>

          <button className="mr-5 mt-2 p-2 h-12 border-2 border-gray-300 rounded-full text-xs hoverEffect">
            Edit Profile
          </button>
        </div>

        <div className="px-5 mb-5">
          <h1>{session?.displayName}</h1>
          <p className="text-xs text-gray-500">{session?.email}</p>
        </div>
      </div>

      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stories post={post} id={post.id} dbName="stories" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
