import CommentsModal from "@/components/feeds/CommentsModal";
import Feed from "../components/feeds/Feed";
import Sidebar from "../components/layout/Sidebar";
import Widget from "../components/widget/Widget";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto">
      <Sidebar page="home" />
      <Feed />
      <Widget />
      <CommentsModal />
    </main>
  );
}
