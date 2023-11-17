import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import MessageRoom from "@/components/messages/MessageRoom";
import Widget from "@/components/widget/Widget";

export default function page() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto ">
      <Sidebar page="message" />
      <MessageRoom />
      <Widget />
    </main>
  );
}
