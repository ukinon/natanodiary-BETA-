import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export default function GalleryWidget() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "stories"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setImages(snapshot.docs.map((doc) => doc.data().image));
      }
    );
  }, []);
  return (
    <div className="max-w-[90%] sticky top-16">
      <div className="bg-gray-200 rounded-xl flex flex-col p-5 gap-3">
        <h3 className="font-bold text-lg">Our latest photos</h3>
        <div className="flex flex-col gap-0 rounded-xl h-fit overflow-hidden">
          {images.map((image) => {
            if (image !== undefined) {
              return (
                <img
                  src={image}
                  alt="image"
                  key={image}
                  className="cursor-pointer hover:brightness-75"
                />
              );
            }
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
