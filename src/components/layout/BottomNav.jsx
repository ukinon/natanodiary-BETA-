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
import { useSession, signOut } from "next-auth/react";
import SignInButton from "./SignInButton";

export default function BottomNav({ page }) {
  const { data: session } = useSession();
  return (
    <div className="flex p-2 border-t-2 border-gray-400 bg-white w-full sm:hidden flex-row justify-between gap-3 sm:items-start bottom-0 fixed z-50 rounded-t-lg px-8">
      <SidebarMenu
        text="Home"
        Icon={page == "home" ? HomeSolid : HomeIcon}
        active={page == "home" ? true : false}
        route="/"
      />
      {(session?.user?.uid == "117487005038456689173" ||
        session?.user?.uid == "113102668461930369111") && (
        <SidebarMenu
          text="Diary"
          Icon={page == "diary" ? BookOpenSolid : BookOpenIcon}
          active={page == "diary" ? true : false}
          route="/diary"
        />
      )}
      <SidebarMenu
        text="Notifications"
        Icon={page == "noitf" ? BellSolid : BellIcon}
        active={page == "notif" ? true : false}
      />
      <SidebarMenu
        text="Messages"
        Icon={page == "message" ? InboxSolid : InboxIcon}
        active={page == "message" ? true : false}
      />
      {session ? (
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
