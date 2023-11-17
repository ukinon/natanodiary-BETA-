"use client";

import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import Profile from "@/components/profile/Profile";
import Widget from "@/components/widget/Widget";

export default function page() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto">
      <Sidebar page="profile" />
      <BottomNav page="profile" />
      <Profile />
      <Widget />
    </main>
  );
}
