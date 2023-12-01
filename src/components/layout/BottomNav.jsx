"use client";
import SidebarMenu from "./SidebarMenu.jsx";
import {
  BellIcon,
  BookOpenIcon,
  HomeIcon,
  InboxIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellSolid,
  BookOpenIcon as BookOpenSolid,
  HomeIcon as HomeSolid,
  InboxIcon as InboxSolid,
  UserIcon as UserSolid,
} from "@heroicons/react/24/solid";
import SignInButton from "./SignInButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase.js";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function BottomNav({ page }) {
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
    <div className="flex p-2 border-t-2 border-gray-400 bg-white w-full sm:hidden flex-row justify-between gap-3 sm:items-start bottom-0 fixed z-50 rounded-t-lg px-8">
      <SidebarMenu Icon={page == "home" ? HomeSolid : HomeIcon} route="/" />
      {(session?.uid == "0GKxYyf0pBSecoyngvhVJ3GJgCa2" ||
        session?.uid == "JAUrCBCpj6Vy4WWNCjGGZyTa3bm1") && (
        <SidebarMenu
          Icon={page == "diary" ? BookOpenSolid : BookOpenIcon}
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
          <p className="bg-blue-500 text-center align-middle text-white rounded-full w-fit px-2 py-1 text-[10px] -ml-4 -mt-3 z-50">
            {notifCount}
          </p>
        )}
      </div>

      <SidebarMenu
        Icon={page == "message" ? InboxSolid : InboxIcon}
        route={`/messages`}
      />

      {auth.currentUser ? (
        <SidebarMenu
          Icon={page == "profile" ? UserSolid : UserIcon}
          route="/profile"
        />
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
