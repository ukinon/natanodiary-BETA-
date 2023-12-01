"use client";
import SidebarMenu from "./SidebarMenu.jsx";
import {
  BellIcon,
  EllipsisHorizontalIcon,
  HomeIcon,
  InboxIcon,
  UserIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellSolid,
  EllipsisHorizontalIcon as EllipsisSolid,
  HomeIcon as HomeSolid,
  InboxIcon as InboxSolid,
  UserIcon as UserSolid,
  BookOpenIcon as BookOpenSolid,
} from "@heroicons/react/24/solid";
import SignInButton from "./SignInButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase.js";
import { redirect } from "next/navigation.js";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export default function Sidebar({ page }) {
  const [session] = useAuthState(auth);
  const [notifCount, setNotifCount] = useState();

  useEffect(() => {
    const setNotif = async () => {
      if (session) {
        const q = query(
          collection(db, "notifications", session?.uid, "notifications"),
          where("isRead", "==", false)
        );

        const unsubscribe = onSnapshot(q, (doc) => setNotifCount(doc.size));

        return () => unsubscribe();
      }
    };
    setNotif();
  }, [session]);

  return (
    <div className="hidden sm:flex flex-col gap-3 sm:items-start fixed xl:ml-20 ml-4 h-screen justify-between">
      <div className="">
        <div className="flex font-semibold p-3 hoverEffect">
          <p>N</p>
          <p className="text-blue-700">D</p>
        </div>

        <div className="mt-2 mb-2 xl:items-start">
          <SidebarMenu
            Icon={page == "home" ? HomeSolid : HomeIcon}
            active={page == "home" ? true : false}
            route="/"
          />
          {(session?.uid == "0GKxYyf0pBSecoyngvhVJ3GJgCa2" ||
            session?.uid == "JAUrCBCpj6Vy4WWNCjGGZyTa3bm1") && (
            <SidebarMenu
              Icon={page == "diary" ? BookOpenSolid : BookOpenIcon}
              active={page == "diary" ? true : false}
              route="/diary"
            />
          )}

          <div className="flex flex-row items-center">
            <SidebarMenu
              Icon={page == "notif" ? BellSolid : BellIcon}
              active={page == "notif" ? true : false}
              route={`/notifications/${session?.uid}`}
            />
            {notifCount > 0 && (
              <p className="bg-blue-500 text-center align-middle text-white rounded-full w-fit px-2 py-1 text-[10px] -ml-5 -mt-3 z-50">
                {notifCount}
              </p>
            )}
          </div>

          <SidebarMenu
            Icon={page == "message" ? InboxSolid : InboxIcon}
            active={page == "message" ? true : false}
            route={`/messages`}
          />

          <SidebarMenu
            Icon={page == "profile" ? UserSolid : UserIcon}
            route="/profile"
            active={page == "profile" ? true : false}
          />
        </div>
      </div>

      <div className="hoverEffect flex items-center bg-gray-100">
        {auth.currentUser ? (
          <>
            <img
              onClick={() => {
                auth.signOut();
                window.location = "/";
              }}
              className="h-10 xl:mr-2 rounded-full"
              src={session?.photoURL}
              alt="user"
            />
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
}
