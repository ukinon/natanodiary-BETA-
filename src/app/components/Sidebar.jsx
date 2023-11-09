import Image from "next/image";
import SidebarMenu from "./SidebarMenu";
import {
  BellIcon,
  EllipsisHorizontalIcon,
  HomeIcon,
  InboxIcon,
  UserIcon,
} from "@heroicons/react/20/solid";

export default function Sidebar() {
  return (
    <div className="hidden sm:flex flex-col gap-3 sm:items-start fixed">
      <div className="hidden xl:flex font-semibold p-3 hoverEffect">
        <p>Natano</p>
        <p className="text-blue-700">Diary</p>
      </div>

      <div className="flex xl:hidden font-semibold p-3 hoverEffect">
        <p>N</p>
        <p className="text-blue-700">D</p>
      </div>

      <div className="mt-4 mb-2 xl:items-start">
        <SidebarMenu text="Home" Icon={HomeIcon} active />
        <SidebarMenu text="Notifications" Icon={BellIcon} />
        <SidebarMenu text="Messages" Icon={InboxIcon} />
        <SidebarMenu text="Profile" Icon={UserIcon} />
      </div>

      <button className="p-3 bg-blue-500 rounded-full text-white w-56 h-12 font-bold shadow-md hover:brightness-75 text-lg hidden xl:inline">
        Post
      </button>

      <div className="hoverEffect text-gray-700 flex items-center space-x-3 justify-center xl:justify-start mt-auto bottom-3 fixed">
        <img
          className="h-10 rounded xl:mr-2"
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="user"
        />
        <div className="leading-5 hidden xl:inline">
          <h4 className="font-bold">Arfiano Jordhy</h4>
          <p>@ukinoshitty</p>
        </div>
        <EllipsisHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
      </div>
    </div>
  );
}
