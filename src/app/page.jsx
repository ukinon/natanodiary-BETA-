"use client";

import CommentsModal from "@/components/feeds/CommentsModal";
import Feed from "../components/feeds/Feed";
import Sidebar from "../components/layout/Sidebar";
import Widget from "../components/widget/Widget";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto ">
      <Sidebar page="home" />
      <BottomNav page="home" />
      <Feed />
      <Widget />
      <CommentsModal dbName="stories" />
    </main>
  );
}
