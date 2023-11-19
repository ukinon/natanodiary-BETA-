"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SidebarMenu({ text, Icon, active, route }) {
  if (route == undefined) {
    route = "/";
  }

  return (
    <Link href={route}>
      <div className="hoverEffect flex items-center space-x-3 justify-center xl:justify-start">
        <Icon className="h-7" />
      </div>
    </Link>
  );
}
