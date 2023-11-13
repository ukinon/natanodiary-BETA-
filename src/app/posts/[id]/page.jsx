"use client";
import CommentsModal from "@/components/CommentsModal";
import Feed from "@/components/Feed";
import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";
import Stories from "@/components/Stories";
import Widget from "@/components/Widget";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { doc, onSnapshot } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../../../firebase";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [post, setPost] = useState();

  useEffect(
    () => onSnapshot(doc(db, "stories", id), (snapshot) => setPost(snapshot)),
    [db, id]
  );

  console.log(post);

  return (
    <main className="flex min-h-screen max-w-7xl mx-auto">
      <Sidebar />
      <div className="xl:ml-[300px] xl:min-w-[650px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-200 flex-grow max-w-xl">
        <div className="flex py-2 px-3 sticky items-center border-b-2 justify-between bg-white top-0 z-50">
          <div className="flex flex-row gap-2 items-center">
            <ArrowLeftIcon
              className="h-10 hoverEffect"
              onClick={() => router.push("/")}
            />
            <h2 className="text-lg font-semibold cursor-pointer">Post</h2>
          </div>
        </div>
        <Stories id={id} post={post} />
      </div>
      <Widget />
      <CommentsModal />
    </main>
  );
}
