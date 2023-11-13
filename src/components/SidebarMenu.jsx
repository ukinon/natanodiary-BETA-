"use client";

export default function SidebarMenu({ text, Icon, active }) {
  return (
    <div className="hoverEffect flex items-center space-x-3 justify-center xl:justify-start">
      {" "}
      <Icon className="h-7" />
      <span className={`${active && "font-bold"} hidden xl:flex`}>{text}</span>
    </div>
  );
}
