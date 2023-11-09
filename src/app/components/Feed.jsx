import { HeartIcon, SparklesIcon } from "@heroicons/react/20/solid";
import Post from "./Post";
import Stories from "./Stories";

export default function Feed() {
  const posts = [
    {
      id: 1,
      name: "Arfiano Jordhy",
      username: "@ukinoshitty",
      userImg: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      post: "Hello",
      postImg:
        "https://awsimages.detik.net.id/community/media/visual/2022/08/09/anime-aesthetic-7_169.jpeg?w=600&q=90",
      timestamp: "1 minute ago",
    },
    {
      id: 2,
      name: "Arfiano Jordhy",
      username: "@ukinoshitty",
      userImg: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      post: "Hello",
      postImg:
        "https://awsimages.detik.net.id/community/media/visual/2022/08/09/anime-aesthetic-7_169.jpeg?w=600&q=90",
      timestamp: "1 minute ago",
    },
    {
      id: 3,
      name: "Arfiano Jordhy",
      username: "@ukinoshitty",
      userImg: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      post: "Hello",
      postImg:
        "https://awsimages.detik.net.id/community/media/visual/2022/08/09/anime-aesthetic-7_169.jpeg?w=600&q=90",
      timestamp: "1 minute ago",
    },
  ];

  return (
    <div className="xl:ml-[355px] xl:min-w-[600px] sm:ml-[73px] border border-l-2 border-r-2 border-gray-200 flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky items-center border-b-2 justify-between bg-white top-0 z-50">
        <h2 className="text-lg font-semibold cursor-pointer">Home</h2>
        <div className="hoverEffect py-0">
          <HeartIcon className="h-8" />
        </div>
      </div>

      <Post />

      {posts.map((post) => {
        return <Stories key={post.id} post={post} />;
      })}
    </div>
  );
}
