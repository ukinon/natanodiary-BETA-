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
import { auth } from "../../../firebase.js";
import { redirect } from "next/navigation.js";

export default function Sidebar({ page }) {
  const [session] = useAuthState(auth);

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

          <SidebarMenu
            Icon={page == "notif" ? BellSolid : BellIcon}
            active={page == "notif" ? true : false}
            route={`/notifications/${session?.uid}`}
          />

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
