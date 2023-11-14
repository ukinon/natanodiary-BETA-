"use client";

import { HeartIcon, SparklesIcon } from "@heroicons/react/20/solid";
import Post from "./Post";
import Stories from "./Stories";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { searchState } from "@/atom/searchAtom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useRecoilState(searchState);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "stories"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const filteredPosts = snapshot.docs.filter((post) =>
          post.data().text.includes(search)
        );
        setPosts(snapshot.docs);
        if (filteredPosts.length > 0) {
          setPosts(filteredPosts);
        }
      }
    );
    return () => unsubscribe();
  }, [search]);

  return (
    <div className="xl:ml-[300px] xl:min-w-[650px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-200 flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky z-20 items-center border-b-2 justify-between bg-white top-0 ">
        <h2 className="text-lg font-semibold cursor-pointer">Home</h2>
        <div className="hoverEffect py-0">
          <HeartIcon className="h-8" />
        </div>
      </div>

      <Post />
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stories post={post} id={post.id} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
