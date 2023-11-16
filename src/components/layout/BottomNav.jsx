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
import { auth } from "../../../firebase.js";

export default function BottomNav({ page }) {
  const [session] = useAuthState(auth);
  return (
    <div className="flex p-2 border-t-2 border-gray-400 bg-white w-full sm:hidden flex-row justify-between gap-3 sm:items-start bottom-0 fixed z-50 rounded-t-lg px-8">
      <SidebarMenu
        text="Home"
        Icon={page == "home" ? HomeSolid : HomeIcon}
        active={page == "home" ? true : false}
        route="/"
      />
      {(session?.uid == "0GKxYyf0pBSecoyngvhVJ3GJgCa2" ||
        session?.uid == "JAUrCBCpj6Vy4WWNCjGGZyTa3bm1") && (
        <SidebarMenu
          text="Diary"
          Icon={page == "diary" ? BookOpenSolid : BookOpenIcon}
          active={page == "diary" ? true : false}
          route="/diary"
        />
      )}
      <SidebarMenu
        text="Notifications"
        Icon={page == "notif" ? BellSolid : BellIcon}
        active={page == "notif" ? true : false}
        route={`/notifications/${session?.uid}`}
      />

      {(session?.uid == "0GKxYyf0pBSecoyngvhVJ3GJgCa2" ||
        session?.uid == "JAUrCBCpj6Vy4WWNCjGGZyTa3bm1") && (
        <SidebarMenu
          text="Messages"
          Icon={page == "message" ? InboxSolid : InboxIcon}
          active={page == "message" ? true : false}
          route={`/chat/${session?.uid}`}
        />
      )}
      {auth.currentUser ? (
        <SidebarMenu
          text="Profile"
          Icon={page == "profile" ? UserSolid : UserIcon}
          route="/profile"
          active={page == "profile" ? true : false}
        />
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
