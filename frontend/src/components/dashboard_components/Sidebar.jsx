import React from "react";
import { MessageCircle, Video, Users, Calendar, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
// import { cn } from "@/lib/utils"; // for conditional class merging (if you already use cn elsewhere)
import { cn } from "../../lib/utils";

export const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const navItems = [
    { icon: <MessageCircle />, label: "Chat", path: "/dashboard/chat" },
    { icon: <Video />, label: "Meet", path: "/dashboard/meet" },
    { icon: <Users />, label: "Communities", path: "/dashboard/communities" },
    { icon: <Calendar />, label: "Calendar", path: "/dashboard/calendar" },
    { icon: <Bell />, label: "Activity", path: "/dashboard/activity" },
  ];

  return (
    <aside
      className={cn(
        "fixed md:static top-0 left-0 h-full w-16 md:w-20 bg-[#0A0A0A] border-r border-[#222] py-4 flex flex-col justify-between transition-transform duration-300 z-50",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* --- Top: Teams Icon --- */}
      <div className="flex flex-col items-center">
        <div className="mb-6">
          {/* Teams icon slot (add your own SVG if needed) */}
          <svg
            width="1em"
            height="1em"
            viewBox="2 2 20 20"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            data-tid="titlebar-teams-icon"
            font-size="20px"
            class="___lpu8x10 f1w7gpdv fez10in fg4l7m0 f1joal8y fmg4s26 fmihtst f2ht21 f1msd6ry"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M21.0344 10.0012H16.8734L15.7124 10.9402V15.5972C15.7124 17.3262 17.1134 18.7282 18.8424 18.7282C20.5724 18.7282 21.9734 17.3262 21.9734 15.5972V10.9402C21.9734 10.4222 21.5534 10.0012 21.0344 10.0012Z"
              fill="#5059C9"
            ></path>
            <path
              d="M22 7C22 8.104 21.105 9 20 9C18.895 9 18 8.104 18 7C18 5.896 18.895 5 20 5C21.105 5 22 5.896 22 7Z"
              fill="#5059C9"
            ></path>
            <path
              d="M9.89214 10.0046H17.0961C17.5921 10.0046 17.9941 10.4066 17.9941 10.9026V16.5946C17.9941 19.0306 16.0201 21.0046 13.5841 21.0046H13.4041C10.9681 21.0046 8.99414 19.0306 8.99414 16.5946V10.9026C8.99414 10.4066 9.39614 10.0046 9.89214 10.0046Z"
              fill="#7B83EB"
            ></path>
            <path
              d="M16.9065 5.99999C16.9065 7.60499 15.6055 8.90699 13.9995 8.90699C12.3945 8.90699 11.0935 7.60499 11.0935 5.99999C11.0935 4.39499 12.3945 3.09299 13.9995 3.09299C15.6055 3.09299 16.9065 4.39499 16.9065 5.99999Z"
              fill="#7B83EB"
            ></path>
            <path
              opacity="0.5"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.0001 8.6814V8.0004C15.0001 7.4504 14.5281 7.0004 13.9511 7.0004H11.2711C11.6881 8.0944 12.7391 8.8754 13.9801 8.8754C14.3401 8.8754 14.6821 8.8014 15.0001 8.6814ZM8.99414 10.9024C8.99414 10.4064 9.39614 10.0044 9.89214 10.0044H15.0001V17.8394C15.0001 18.3894 14.3821 19.0004 13.7451 19.0004H9.71514C9.26214 18.3074 8.99414 17.4834 8.99414 16.5944V10.9024Z"
              fill="black"
            ></path>
            <path
              d="M3 18C2.45 18 2 17.55 2 17V7C2 6.45 2.45 6 3 6H13C13.55 6 14 6.45 14 7V17C14 17.55 13.55 18 13 18H3Z"
              fill="#4B53BC"
            ></path>
            <path
              d="M11.0001 10H8.83511V15.82H7.41211V10H5.23511V8.57001H11.0001V10Z"
              fill="white"
            ></path>
          </svg>{" "}
        </div>

        {/* --- Navigation items --- */}
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center text-[11px] ${
                  isActive ? "text-[#8B8BFF]" : "text-white/70 hover:text-white"
                }`}
              >
                <div className="p-2 rounded-md">
                  {React.cloneElement(item.icon, {
                    size: 20,
                    color: isActive ? "#8B8BFF" : "white",
                  })}
                </div>
                <span className="block text-[10px] md:text-[11px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- Bottom: Premium diamond icon --- */}
      <div className="flex flex-col items-center mt-6">
        <svg
          className="text-[#8B8BFF]"
          fill="currentColor"
          aria-hidden="true"
          width="22"
          height="22"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.5 2.75a.75.75 0 0 0-.66.39l-2.75 5c-.15.27-.11.6.08.84l7.25 8.75a.75.75 0 0 0 1.16 0l7.25-8.75c.2-.24.23-.57.08-.84l-2.75-5a.75.75 0 0 0-.66-.39h-9ZM4.16 7.5l1.78-3.25h1.5L6.31 7.5H4.16ZM6.14 9l1.93 4.75L4.14 9h2ZM10 14.48 7.76 9h4.39l-2.16 5.48ZM7.89 7.5l1.14-3.25h1.95l1.2 3.25H7.88Zm5.88 0-1.2-3.25h1.49l1.78 3.25h-2.07Zm0 1.5h2.1l-4.01 4.83L13.76 9Z" />
        </svg>
      </div>
    </aside>
  );
};
