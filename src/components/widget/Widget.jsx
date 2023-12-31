"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GalleryWidget from "./GalleryWidget";
import { useRecoilState } from "recoil";
import { searchState } from "@/atom/searchAtom";

export default function Widget() {
  const [search, setSearch] = useRecoilState(searchState);

  function handleSearch(e) {
    setSearch(e.target.value);
    console.log(search);
  }

  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-8">
      <div className="w-[90%] sticky top-0 bg-white z-50 py-1.5">
        <div className="flex items-center p-3 rounded-full bg-white relative">
          <MagnifyingGlassIcon className="h-5 z-50 text-gray-500" />
          <input
            type="text"
            placeholder="Search Diary"
            onChange={handleSearch}
            className="absolute inset-0 rounded-full outline-none border-2 border-gray-300 pl-10 focus:shadow-lg bg-white"
          />
        </div>
      </div>

      <GalleryWidget />
    </div>
  );
}
