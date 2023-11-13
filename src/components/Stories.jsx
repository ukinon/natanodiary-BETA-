import { TrashIcon } from "@heroicons/react/20/solid";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function Stories({ post }) {
  return (
    <div className="flex gap-2 mb-3 border-b-2 p-3">
      <img src={post.userImg} alt="user" className="h-10 " />
      <div className="flex flex-col w-full">
        <div className=" flex justify-between ">
          <div className="flex gap-2 items-center">
            <h4 className="font-bold text-sm">{post.name}</h4>
            <p className="text-xs">{post.username}</p>
            <span className="text-xs">{post.timestamp}</span>
          </div>

          <TrashIcon className="hoverEffect h-10" />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm">{post.post}</h3>
          <img src={post.postImg} alt="" className="max-w-sm rounded-xl" />
        </div>
        <div className="flex flex-row gap-2">
          <ChatBubbleOvalLeftEllipsisIcon className="h-11 hoverEffect" />
          <HeartIcon className="h-11 hover:text-red-400 hoverEffect" />
        </div>
      </div>
    </div>
  );
}
