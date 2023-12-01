"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Moment from "react-moment";

export default function NotificationSection() {
  const router = useRouter();
  const [session] = useAuthState(auth);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const setNotif = async () => {
      if (session) {
        const q = query(
          collection(db, "notifications", session?.uid, "notifications"),
          where("isRead", "==", false)
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (document) => {
          const docRef = doc(
            db,
            "notifications",
            session?.uid,
            "notifications",
            document.id
          );

          await updateDoc(docRef, {
            isRead: true,
          });
        });

        return () => unsubscribe();
      }
    };
    setNotif();
  }, [session]);

  useEffect(() => {
    if (session) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "notifications", session?.uid, "notifications"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setNotifs(snapshot.docs)
      );
      return () => unsubscribe();
    }
  }, [session]);

  return (
    <div className="xl:ml-[150px] mb-12 sm:mb-0 xl:min-w-[650px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-100 flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky items-center border-b-2 border-gray-100 justify-between bg-white top-0 z-50">
        <div className="flex flex-row gap-2 items-center">
          <ArrowLeftIcon
            className="h-7 hoverEffect"
            onClick={() => router.push("/")}
          />
          <h2 className="text-lg font-semibold cursor-pointer">
            Notifications
          </h2>
        </div>
      </div>
      <div className="">
        {notifs.map((notif) => {
          return (
            <div
              className="flex flex-row gap-3 items-start justify-start border-b-2 mx-0 border-x-0 p-5"
              key={notif.id}
            >
              <img
                src={notif.data().userPicture}
                className="rounded-full h-8 lg:h-12"
              />
              <div className="flex flex-col gap-3 w-2/3">
                <p className="text-[12px] lg:text-xs ">
                  {notif.data().content}
                </p>
                <div
                  className="flex flex-row items-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-200 transition-all ease-linear"
                  onClick={() => {
                    return router.push(`/posts/${notif.data().postId}/stories`);
                  }}
                >
                  <img
                    src={notif.data().postUserImage}
                    className="rounded-full h-5 lg:h-9"
                  />
                  <p className="text-xs lg:text-sm">{notif.data().text}</p>
                </div>
              </div>
              <Moment
                fromNow
                className="text-[10px] lg:text-[13px] text-gray-400"
              >
                {notif.data().timestamp.toDate()}
              </Moment>
            </div>
          );
        })}
      </div>
    </div>
  );
}
