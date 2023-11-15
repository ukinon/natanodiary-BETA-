"use client";

import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import Widget from "@/components/widget/Widget";
import CommentsModal from "@/components/feeds/CommentsModal";
import Diary from "@/components/diary/Diary";
import { useSession } from "next-auth/react";

export default function page() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto ">
      <Sidebar page="diary" />
      <BottomNav page="diary" />
      <Diary />
      <Widget />
      <CommentsModal />
    </main>
  );
}
