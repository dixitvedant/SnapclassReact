"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";



import {
  LayoutDashboard,
  Camera,
  BookOpen,
  ClipboardList,
  CalendarClock,
  Bell,
  Megaphone,
  LogOut,
  AlertTriangle,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState(0);

  // =====================================
  // LOAD NOTIFICATIONS
  // =====================================

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const teacher = JSON.parse(localStorage.getItem("teacher_data"));

        if (!teacher) return;

        const res = await fetch(
          `http://127.0.0.1:8000/teacher-notifications/teacher/${teacher.teacher_id}`,
        );

        const data = await res.json();

        console.log("Notifications:", data);

        if (data.success) {
          setUnreadCount(data.unread || 0);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadNotifications();
  }, []);

  const menus = [
    {
      icon: LayoutDashboard,

      title: "Dashboard",

      href: "/teacher/dashboard",
    },

    {
      icon: Camera,

      title: "Take Attendance",

      href: "/teacher/dashboard/attendance",
    },

    {
      icon: BookOpen,

      title: "Subjects",

      href: "/teacher/dashboard/manage-subject",
    },

    {
      icon: ClipboardList,

      title: "Records",

      href: "/teacher/dashboard/attendence-records",
    },

    {
      icon: CalendarClock,

      title: "Lectures",

      href: "/teacher/dashboard/lectures",
    },

    {
      icon: Megaphone,

      title: "Announcements",

      href: "/teacher/dashboard/announcements",
    },

    {
      icon: Bell,

      title: "Notifications",

      href: "/teacher/dashboard/notifications",
    },
    {
      icon: AlertTriangle,
      title: "Defaulters",
      href: "/teacher/dashboard/defaulters",
    },
  ];

  return (
    <aside
      className="
      w-[280px]
      m-5
      rounded-[36px]
      bg-white/70
      backdrop-blur-3xl
      border
      border-white/60
      shadow-[0_20px_60px_rgba(0,0,0,.10)]
      p-6
      flex
      flex-col
      shrink-0
      "
    >
      {/* LOGO */}

      <h1
        className="
        text-3xl
        font-black
        text-slate-900
        mb-10
        "
      >
        Smart
        <span
          className="
          text-violet-600
          "
        >
          Attend
        </span>
      </h1>

      {/* MENUS */}

      <div
        className="
        flex
        flex-col
        gap-3
        "
      >
        {menus.map((item, i) => {
          const Icon = item.icon;

          return (
            <button
              key={i}
              onClick={() => router.push(item.href)}
              className="
                  h-14
                  rounded-2xl
                  px-5
                  flex
                  items-center
                  gap-4
                  text-slate-700
                  hover:bg-violet-50
                  hover:text-violet-700
                  hover:-translate-y-[2px]
                  transition-all
                  duration-300
                  "
            >
              {/* ICON */}

              <div
                className="
                  relative
                  "
              >
                <Icon size={20} />

                {item.title === "Notifications" && unreadCount > 0 && (
                  <span
                    className="
                        absolute
                        -top-2
                        -right-2
                        min-w-[20px]
                        h-5
                        px-1
                        rounded-full
                        bg-red-500
                        text-white
                        text-[11px]
                        font-bold
                        flex
                        items-center
                        justify-center
                        "
                  >
                    {unreadCount}
                  </span>
                )}
              </div>

              {item.title}
            </button>
          );
        })}
      </div>

      <div
        className="
        flex-1
        "
      />

      {/* LOGOUT */}

      <button
        onClick={() => {
          localStorage.clear();

          router.push("/teacher/login");
        }}
        className="
        h-14
        rounded-2xl
        mt-8
        bg-gradient-to-r
        from-violet-600
        to-purple-500
        text-white
        flex
        items-center
        justify-center
        gap-2
        font-semibold
        shadow-lg
        hover:scale-[1.02]
        transition
        "
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
