import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import Widget from "./components/Widget";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-7xl mx-auto">
      <Sidebar />
      <Feed />
      <Widget />
    </main>
  );
}
