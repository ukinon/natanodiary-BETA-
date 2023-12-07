"use client";

import CommentsModal from "@/components/feeds/CommentsModal";
import Feed from "../components/feeds/Feed";
import Sidebar from "../components/layout/Sidebar";
import Widget from "../components/widget/Widget";
import BottomNav from "@/components/layout/BottomNav";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(function (OneSignal) {
      OneSignal.init({
        appId: "e9f61fae-12ec-42e6-9815-2f387a656166",
        safari_web_id:
          "web.onesignal.auto.11181d92-f3cb-414e-9b3e-6471e643153c",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      });
    });
    return () => {
      window.OneSignal = undefined;
    };
  }, []);
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
