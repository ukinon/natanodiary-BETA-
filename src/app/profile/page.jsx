import Sidebar from "@/components/layout/Sidebar";
import Profile from "@/components/profile/Profile";
import Widget from "@/components/widget/Widget";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto">
      <Sidebar page="profile" />
      <Profile />
      <Widget />
    </main>
  );
}
