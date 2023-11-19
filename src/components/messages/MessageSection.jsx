"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRecoilState } from "recoil";
import { selectedChatState, userChatState } from "@/atom/chatAtom";
import MessageRoom from "./MessageRoom";
import { isMobile } from "react-device-detect";

export default function MessageSection() {
  const router = useRouter();
  const [session] = useAuthState(auth);
  const [chats, setChats] = useState();
  const [latestChat, setLatestChat] = useState("");
  const [userChat, setUserChatState] = useRecoilState(userChatState);
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);

  useEffect(() => {
    if (session) {
      const unsubscribe = onSnapshot(
        query(collection(db, "chats")),

        (snapshot) => {
          const extractedData = [];
          const result = snapshot.docs;
          const filteredData = [];

          const resultFilter = result.map((doc) => {
            return doc.data().users;
          });
          const latestMessage = result.map((doc) => {
            return doc.data().latestMessage;
          });

          for (let i = 0; i < resultFilter.length; i++) {
            const innerArray = resultFilter[i];
            for (let j = 0; j < innerArray.length; j++) {
              if (innerArray[j].uid === session.uid) {
                extractedData.push(resultFilter[i]);
              }
              innerArray[j].latestMessage = latestMessage[i];
            }
          }

          for (let i = 0; i < extractedData.length; i++) {
            for (let j = 0; j < extractedData[i].length; j++) {
              filteredData.push(extractedData[i][j]);
            }
          }

          const userChats = filteredData.filter((chat) => {
            return chat.uid !== session.uid;
          });

          console.log(userChats);

          setChats(userChats);
        }
      );
      return () => unsubscribe();
    }
  }, [db, session]);

  useEffect(() => {
    if (session) {
      const unsubscribe = onSnapshot(
        query(collection(db, "chats")),

        (snapshot) => {
          const result = snapshot.docs;
          setLatestChat(result);
        }
      );
      return () => unsubscribe();
    }
  }, [db, session]);

  const handleChatClick = async (user) => {
    if (session) {
      const combinedId =
        session?.uid > user.uid
          ? session.uid + user.uid
          : user.uid + session?.uid;

      await setUserChatState(user);
      await setSelectedChat(combinedId);

      if (isMobile) {
        router.push("/chat");
      }
    }
  };

  return (
    <>
      <div className="xl:ml-[150px] mb-12 sm:mb-0 xl:w-[200px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-100 flex-grow max-w-xl">
        <div className="flex py-2 px-3 sticky items-center border-b-2 border-gray-100 justify-between bg-white top-0 z-50">
          <div className="flex flex-row gap-2 items-center">
            <ArrowLeftIcon
              className="h-7 xl:h-8 hoverEffect"
              onClick={() => router.back()}
            />
            <h2 className="text-lg font-semibold cursor-pointer">Messages</h2>
          </div>
        </div>
        <div className="flex justify-end mr-2">
          <PlusCircleIcon
            onClick={() => router.push("/addChats")}
            className="h-20 fixed bottom-5 text-blue-500 hover:brightness-75 cursor-pointer mb-12 sm:mb-0"
          />
        </div>

        {chats &&
          chats.map((chat) => (
            <div
              className={`${
                chat.uid == userChat.uid ? "bg-gray-200 rounded-xl" : "bg-white"
              } flex flex-row gap-2 p-3 text-xs xl:text-sm cursor-pointer hover:bg-gray-200 transition-all ease-linear`}
              key={chat.uid}
              onClick={() => handleChatClick(chat)}
            >
              <img src={chat.photoURL} alt="" className="h-12 rounded-full" />
              <div className="flex flex-col justify-center">
                <h2>{chat.displayName}</h2>

                {chat.latestMessage != undefined && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {chat.latestMessage}
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>

      {selectedChat != "hi" && !isMobile && <MessageRoom />}
    </>
  );
}
