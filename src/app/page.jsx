"use client";

import CommentsModal from "@/components/feeds/CommentsModal";
import Feed from "../components/feeds/Feed";
import Sidebar from "../components/layout/Sidebar";
import Widget from "../components/widget/Widget";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch or perform actions when the session changes
      const currentSession = await getSession();
      console.log("Session changed:", currentSession);
      // You can perform additional actions or data fetching here
    };

    fetchData();
  }, [session]);

  return (
    <main className="flex min-h-screen max-w-7xl mx-auto">
      <Sidebar page="home" />
      <Feed />
      <Widget />
      <CommentsModal />
    </main>
  );
}
