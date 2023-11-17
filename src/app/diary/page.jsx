"use client";

import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import Widget from "@/components/widget/Widget";
import CommentsModal from "@/components/feeds/CommentsModal";
import Diary from "@/components/diary/Diary";
import { auth } from "../../../firebase";
import { redirect } from "next/navigation";

export default function page() {
  if (
    auth?.currentUser?.uid != "JAUrCBCpj6Vy4WWNCjGGZyTa3bm1" &&
    auth?.currentUser?.uid != "0GKxYyf0pBSecoyngvhVJ3GJgCa2"
  ) {
    redirect("/");
  }
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto ">
      <Sidebar page="diary" />
      <BottomNav page="diary" />
      <Diary />
      <Widget />
      <CommentsModal dbName="diary" />
    </main>
  );
}
