import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import MessageSection from "@/components/messages/MessageSection";
import Widget from "@/components/widget/Widget";
import React from "react";

export default function page() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto ">
      <Sidebar page="message" />
      <BottomNav page="message" />
      <MessageSection />
      <Widget />
    </main>
  );
}
