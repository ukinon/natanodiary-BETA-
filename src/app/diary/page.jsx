"use client";

import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import Widget from "@/components/widget/Widget";
import CommentsModal from "@/components/feeds/CommentsModal";
import Feed from "@/components/feeds/Feed";

export default function page() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto ">
      <Sidebar page="home" />
      <BottomNav page="home" />
      <Feed />
      <Widget />
      <CommentsModal />
    </main>
  );
}
