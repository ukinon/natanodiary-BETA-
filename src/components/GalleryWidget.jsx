import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function GalleryWidget() {
  const images = [
    {
      id: 1,
      imgUrl:
        "https://png.pngtree.com/thumb_back/fh260/background/20230518/pngtree-the-manga-couple-of-anime-i-love-you-in-autumn-image_2579703.jpg",
    },
    {
      id: 2,
      imgUrl:
        "https://png.pngtree.com/thumb_back/fh260/background/20230518/pngtree-the-manga-couple-of-anime-i-love-you-in-autumn-image_2579703.jpg",
    },
    {
      id: 3,
      imgUrl:
        "https://png.pngtree.com/thumb_back/fh260/background/20230518/pngtree-the-manga-couple-of-anime-i-love-you-in-autumn-image_2579703.jpg",
    },
  ];

  return (
    <div className="max-w-[90%] sticky top-16">
      <div className="bg-gray-200 rounded-xl flex flex-col p-5 gap-3">
        <h3 className="font-bold text-lg">Our latest photos</h3>
        <div className="flex flex-col gap-0 rounded-xl h-fit overflow-hidden">
          {images.map((image) => {
            return (
              <img
                src={image.imgUrl}
                alt="image"
                key={image.id}
                className="cursor-pointer hover:brightness-75"
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 justify-end text-blue-500">
          <a href="#" className="text-sm">
            View All
          </a>
          <ArrowRightIcon className="h-4" />
        </div>
      </div>
    </div>
  );
}
