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
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import SignInButton from "./SignInButton";
import { useId } from "react";

export default function Sidebar({ page }) {
  const { data: session } = useSession();

  return (
    <div className="hidden sm:flex flex-col gap-3 sm:items-start fixed xl:ml-8 ml-4">
      <div className="hidden xl:flex font-semibold p-3 hoverEffect">
        <p>Natano</p>
        <p className="text-blue-700">Diary</p>
      </div>

      <div className="flex xl:hidden font-semibold p-3 hoverEffect">
        <p>N</p>
        <p className="text-blue-700">D</p>
      </div>

      <div className="mt-2 mb-2 xl:items-start">
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
        <SidebarMenu
          text="Profile"
          Icon={page == "profile" ? UserSolid : UserIcon}
          route="/profile"
          active={page == "profile" ? true : false}
        />
      </div>
      <div className="flex justify-center">
        <button className="p-3 bg-blue-500 rounded-full text-white w-56 h-12 font-bold shadow-md hover:brightness-75 text-lg hidden xl:inline">
          Post
        </button>
      </div>

      <div className="hoverEffect text-gray-700 flex items-center space-x-3 justify-center mt-auto bottom-3 fixed bg-gray-100 overflow-hidden whitespace-nowrap">
        {session ? (
          <>
            <img
              className="h-10 xl:mr-2 rounded-full"
              src={session?.user?.image}
              alt="user"
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
            />
            <div className="leading-5 hidden xl:inline text-sm overflow-hidden max-w-[110px]">
              <h4 className="font-bold text-sm">{session?.user?.name}</h4>
              <p className="text-xs">@{session?.user?.username}</p>
            </div>
            <EllipsisHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
}
