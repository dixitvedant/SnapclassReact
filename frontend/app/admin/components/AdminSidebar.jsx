"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const router = useRouter();

  function logout() {
    localStorage.removeItem("admin_token");

    localStorage.removeItem("admin_data");

    router.replace("/admin/login");
  }

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      name: "Teachers",
      icon: Users,
      href: "/admin/teachers",
    },
    {
      name: "Students",
      icon: GraduationCap,
      href: "/admin/students",
    },
    {
      name: "Subjects",
      icon: BookOpen,
      href: "/admin/subjects",
    },
    {
      name: "Attendance",
      icon: CalendarDays,
      href: "/admin/attendance",
    },
    {
      name: "Announcements",
      icon: Megaphone,
      href: "/admin/announcements",
    },
    {
      name: "Reports",
      icon: BarChart3,
      href: "/admin/reports",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  return (
  <aside
    className="
    w-72
    min-h-screen
    bg-slate-900
    border-r
    border-slate-800
    shadow-[10px_0_40px_rgba(15,23,42,.35)]
    flex
    flex-col
    "
  >
    {/* ================= LOGO ================= */}

    <div
      className="
      px-8
      pt-10
      pb-8
      "
    >
      <h1
        className="
        text-3xl
        font-black
        bg-gradient-to-r
        from-emerald-400
        to-teal-300
        bg-clip-text
        text-transparent
        "
      >
        SmartAttend
      </h1>

      <p
        className="
        text-slate-400
        mt-2
        text-sm
        tracking-wide
        uppercase
        "
      >
        Admin Panel
      </p>
    </div>

    {/* ================= MENU ================= */}

    <nav
      className="
      flex-1
      px-5
      space-y-3
      "
    >
      {menus.map((item) => {
        const Icon = item.icon;

        const active = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
            relative
            flex
            items-center
            gap-4
            px-5
            py-4
            rounded-2xl
            transition-all
            duration-300
            overflow-hidden

            ${
              active
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-900/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }
            `}
          >
            <Icon size={22} />

            <span
              className="
              font-semibold
              "
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>

    {/* ================= LOGOUT ================= */}

    <div
      className="
      p-5
      "
    >
      <button
        onClick={logout}
        className="
        w-full
        flex
        items-center
        justify-center
        gap-3
        px-5
        py-4
        rounded-2xl
        bg-slate-800
        border
        border-red-500/20
        text-red-400
        font-semibold
        transition-all
        duration-300
        hover:bg-red-600
        hover:text-white
        "
      >
        <LogOut size={20} />

        Logout
      </button>
    </div>
  </aside>
);
}
