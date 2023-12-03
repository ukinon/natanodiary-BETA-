"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function UserList() {
  const [users, setUsers] = useState();
  const router = useRouter();
  const [session] = useAuthState(auth);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/firebase-admin", {
          cache: "no-store",
        });

        const data = await response.json();
        const users = data?.filter(
          (user) => user.uid !== auth?.currentUser?.uid
        );

        setUsers(users);

        return data;
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchUsers();
  }, []);

  async function addChat(user) {
    const combinedId =
      session?.uid > user.uid
        ? session.uid + user.uid
        : user.uid + session?.uid;

    const res = await getDoc(doc(db, "chats", combinedId));

    if (!res.exists()) {
      await setDoc(doc(db, "chats", combinedId), {
        users: [
          {
            uid: session?.uid,
            photoURL: session?.photoURL,
            displayName: session?.displayName,
            email: session?.email,
          },

          {
            uid: user.uid,
            photoURL: user.photoURL,
            displayName: user.displayName,
            email: user.email,
          },
        ],
      });
    }
  }

  return (
    <div className="xl:ml-[300px] mb-12 sm:mb-0 xl:min-w-[200px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-100 flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky items-center border-b-2 border-gray-100 justify-between bg-white top-0 z-50">
        <div className="flex flex-row gap-2 items-center">
          <ArrowLeftIcon
            className="h-7 xl:h-8 hoverEffect"
            onClick={() => router.back()}
          />
          <h2 className="text-lg font-semibold cursor-pointer">
            Add New Chats
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs sm:text-sm">
        {users &&
          users.map((users) => (
            <>
              <div className="flex flex-row items-center p-3 border-2 border-gray-200 justify-between">
                <div className="flex flex-row gap-2">
                  <img
                    src={users.photoURL}
                    alt=""
                    className="h-10 sm:h-12 rounded-full"
                  />
                  <div className="flex flex-col justify-center">
                    <h2>{users.displayName}</h2>
                    <p className="text-xs text-gray-400">{users.email}</p>
                  </div>
                </div>

                <PlusCircleIcon
                  onClick={() => addChat(users)}
                  className="hoverEffect h-8 sm:h-12 text-blue-500 hoverEffect"
                />
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
