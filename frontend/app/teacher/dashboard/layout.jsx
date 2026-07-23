"use client";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function DashboardLayout({
  children
}) {

  return (

    <main
      className="
      min-h-screen
      flex
      bg-gradient-to-br
      from-[#eef4ff]
      via-[#f6f7ff]
      to-[#f1efff]
      overflow-hidden
      "
    >

      <Sidebar />

      <div
        className="
        flex-1
        flex
        flex-col
        min-h-screen
        "
      >

        <Topbar />

        <div
          className="
          p-8
          flex-1
          overflow-auto
          "
        >
          {children}
        </div>

      </div>

    </main>
  );
}