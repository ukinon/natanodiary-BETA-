import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Widget() {
  return (
    <div className="xl:w-[600px] hidden lg:inline ml-10">
      <div className="w-[90%] xl:w-[80%] sticky top-0 bg-white z-50 py-1.5">
        <div className="flex items-center p-3 rounded-full bg-gray-200 relative">
          <MagnifyingGlassIcon className="h-5 z-50 text-gray-500" />
          <input
            type="text"
            placeholder="Search Diary"
            className="absolute inset-0 rounded-full outline-none border-2 border-gray-300 pl-10 focus:shadow-lg bg-gray-200 focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
