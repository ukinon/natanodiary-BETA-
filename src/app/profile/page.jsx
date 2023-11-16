"use client";

import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import Profile from "@/components/profile/Profile";
import Widget from "@/components/widget/Widget";
import { signIn, useSession } from "next-auth/react";

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
