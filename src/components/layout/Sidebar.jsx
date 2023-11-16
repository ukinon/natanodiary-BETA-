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
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth } from "../../../firebase.js";

export default function Sidebar({ page }) {
  const [session] = useAuthState(auth);

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
        {auth.currentUser ? (
          <>
            <img
              onClick={() => {
                auth.signOut();
              }}
              className="h-10 xl:mr-2 rounded-full"
              src={session?.photoURL}
              alt="user"
            />
            <div className="leading-5 hidden xl:inline text-sm overflow-hidden max-w-[110px]">
              <h4 className="font-bold text-sm">{session?.displayName}</h4>
              <p className="text-xs">{session?.email}</p>
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
