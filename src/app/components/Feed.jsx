import { SparklesIcon } from "@heroicons/react/20/solid";

export default function Feed() {
  return (
    <div className="xl:ml-[355px] xl:min-w-[600px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-200 flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky items-center border-b-2 justify-between bg-white top-0 z-50">
        <h2 className="text-lg font-semibold cursor-pointer">Home</h2>
        <div className="hoverEffect py-0">
          <SparklesIcon className="h-8" />
        </div>
      </div>
    </div>
  );
}
