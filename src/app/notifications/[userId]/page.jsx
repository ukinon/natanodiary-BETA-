import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import NotificationSection from "@/components/notification/NotificationSection";
import Widget from "@/components/widget/Widget";
import React from "react";

export default function page() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto ">
      <Sidebar page="notif" />
      <BottomNav page="notif" />
      <NotificationSection />
      <Widget />
    </main>
  );
}
