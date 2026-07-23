"use client";

import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  CheckCircle2,
  CalendarDays,
  Bell,
  User,
  LogOut,
} from "lucide-react";

export default function StudentSidebar() {
  function logout() {
    localStorage.clear();
    window.location.href = "/student/login";
  }

  return (
    <aside
      className="
      w-[260px]
      bg-white
      shadow-xl
      rounded-r-[42px]
      p-6
      hidden
      lg:flex
      flex-col
    "
    >
      <div className="flex items-center gap-3 mb-10">
        <div
          className="
          w-14 h-14
          rounded-3xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          flex items-center justify-center
          text-white
        "
        >
          <GraduationCap />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">Student</h2>
          <p className="text-slate-500">Portal</p>
        </div>
      </div>

      <SidebarItem
        href="/student/dashboard"
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
      />

      {/* <SidebarItem
        href="/student/subjects"
        icon={<BookOpen size={20} />}
        text="Subjects"
      /> */}

      <SidebarItem
        href="/student/attendance"
        icon={<CheckCircle2 size={20} />}
        text="Attendance"
      />

      <SidebarItem
        href="/student/calendar"
        icon={<CalendarDays size={20} />}
        text="Calendar"
      />

      <SidebarItem
        href="/student/notifications"
        icon={<Bell size={20} />}
        text="Notifications"
      />

      <SidebarItem
        href="/student/profile"
        icon={<User size={20} />}
        text="Profile"
      />

      <div className="mt-auto">
        <button
          onClick={logout}
          className="
          w-full
          h-14
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          text-white
          font-semibold
          flex
          items-center
          justify-center
          gap-2
        "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ href, icon, text }) {
  return (
    <Link
      href={href}
      className="
      h-14
      rounded-2xl
      flex
      items-center
      gap-3
      px-4
      mb-3
      text-slate-500
      hover:bg-slate-100
      transition
    "
    >
      {icon}
      {text}
    </Link>
  );
}