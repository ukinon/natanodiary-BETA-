"use client";

import CommentsModal from "@/components/feeds/CommentsModal";
import Feed from "../components/feeds/Feed";
import Sidebar from "../components/layout/Sidebar";
import Widget from "../components/widget/Widget";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch or perform actions when the session changes
      const currentSession = await getSession();
      console.log("Session changed:", currentSession);
      // You can perform additional actions or data fetching here
    };

    // Immediately trigger the callback on mount
    fetchData();

    // Set up an interval to check for session changes
    const intervalId = setInterval(async () => {
      const currentSession = await getSession();

      // Compare session data to check for changes
      if (JSON.stringify(session) !== JSON.stringify(currentSession)) {
        fetchData();
      }
    }, 1000); // Adjust the interval as needed

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [router, session]);

  return (
    <main className="flex min-h-screen max-w-7xl mx-auto">
      <Sidebar page="home" />
      <Feed />
      <Widget />
      <CommentsModal />
    </main>
  );
}
