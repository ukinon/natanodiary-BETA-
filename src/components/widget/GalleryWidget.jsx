"use client";

import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useSession } from "next-auth/react";

export default function GalleryWidget() {
  const [images, setImages] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "stories"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const filteredPosts = snapshot.docs.filter((post) => {
          if (
            session?.user.uid == "117487005038456689173" ||
            session?.user.uid == "113102668461930369111"
          ) {
            return (
              post.data().userId == "113102668461930369111" ||
              post.data().userId == "117487005038456689173"
            );
          } else {
            return (
              post.data().userId != "113102668461930369111" &&
              post.data().userId != "117487005038456689173"
            );
          }
        });
        setImages(filteredPosts.map((doc) => doc.data().image));
      }
    );
  }, [session]);
  return (
    <div className="max-w-[90%] sticky top-16">
      <div className="bg-gray-200 rounded-xl flex flex-col p-5 gap-3">
        <h3 className="font-bold text-lg">Our latest photos</h3>
        <div className="flex flex-col items-center gap-0 rounded-xl h-fit overflow-hidden">
          {images.map((image) => {
            if (image !== undefined) {
              return (
                <img
                  src={image}
                  alt="image"
                  key={image}
                  className="cursor-pointer hover:brightness-75 max-h-32 w-fit"
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
