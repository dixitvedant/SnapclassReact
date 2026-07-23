"use client";

import {
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();

  const bellRef = useRef(null);

  const profileRef = useRef(null);

  const [admin, setAdmin] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const [bellOpen, setBellOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const a = JSON.parse(localStorage.getItem("admin_data") || "null");

      if (!a) return;

      setAdmin(a);

      try {
        const token = localStorage.getItem("admin_token");

        /*
            Later replace with

            /admin-notifications

        */

        // Dummy notifications

        setNotifications([
          {
            id: 1,
            title: "New Teacher Registered",
            message: "A new teacher has been added.",
          },
          {
            id: 2,
            title: "Attendance Completed",
            message: "Today's attendance has been generated.",
          },
          {
            id: 3,
            title: "System Backup",
            message: "Night backup completed successfully.",
          },
        ]);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstName = admin?.name?.split(" ")[0] || "Admin";

  return (
    <header
  className="
  px-8
  pt-6
  "
>
      <div
        className="
        w-full
        rounded-[34px]
        bg-white/80
        backdrop-blur-3xl
        border
        border-emerald-100
        shadow-[0_12px_40px_rgba(16,185,129,.10)]
        px-6
        py-5
        flex
        items-center
        justify-between
        gap-5
        "
      >
        {/* ================= LEFT ================= */}

        <div
          className="
          min-w-0
          flex-1
          "
        >
          <h2
            className="
            text-[26px]
            font-black
            text-slate-800
            truncate
            max-w-[500px]
            "
            title={admin?.name}
          >
            Welcome, {firstName}
          </h2>

          <p
            className="
            text-emerald-600
            font-medium
            text-sm
            mt-1
            "
          >
            SmartAttend Administration
          </p>
        </div>

        {/* ================= RIGHT ================= */}

        <div
          className="
          flex
          items-center
          gap-3
          "
        >
          {/* SEARCH */}

          <div
            className="
            hidden
            lg:flex
            items-center
            gap-3
            h-12
            px-4
            rounded-2xl
            bg-emerald-50/70
            border
            border-emerald-100
            w-[340px]
            "
          >
            <Search size={18} className="text-emerald-600 focus-within:ring-2 focus-within:ring-emerald-300" />

            <input
              placeholder="Search dashboard..."
              className="
              bg-transparent
              outline-none
              flex-1
              text-sm
              text-slate-900
              "
            />
          </div>

          {/* ================= NOTIFICATION ================= */}

          <div
            ref={bellRef}
            className="
            relative
            "
          >
            <button
              onClick={() => setBellOpen(!bellOpen)}
              className="
              relative
              w-12
              h-12
              rounded-2xl
              bg-emerald-50
              border
              border-emerald-100
              shadow-sm
              flex
              items-center
              justify-center
              hover:bg-emerald-100
              transition
              "
            >
              <Bell size={20} className="text-emerald-700" />

              {notifications.length > 0 && (
                <span
                  className="
                  absolute
                  -top-1
                  -right-1
                  w-5
                  h-5
                  rounded-full
                  bg-red-500
                  text-white
                  text-[10px]
                  flex
                  items-center
                  justify-center
                  "
                >
                  {notifications.length}
                </span>
              )}
            </button>

            {bellOpen && (
              <div
                className="
                absolute
                right-0
                mt-3
                w-[340px]
                rounded-3xl
                bg-white
                border
                border-slate-200
                shadow-2xl
                p-4
                z-[9999]
                "
              >
                <h3
                  className="
                  font-bold
                  mb-3
                  text-slate-900
                  "
                >
                  Notifications
                </h3>

                <div
                  className="
                  space-y-3
                  max-h-[300px]
                  overflow-y-auto
                  "
                >
                  {notifications.length === 0 ? (
                    <p className="text-slate-400">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="
                        p-3
                        rounded-2xl
                        bg-emerald-50
                        "
                      >
                        <p
                          className="
                          font-semibold
                          text-slate-900
                          "
                        >
                          {n.title}
                        </p>

                        <p
                          className="
                          text-sm
                          text-slate-500
                          "
                        >
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => router.push("/admin/dashboard/notifications")}
                  className="
                  mt-4
                  w-full
                  h-11
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-600
                  to-teal-600
                  text-white
                  font-semibold
                  "
                >
                  View All
                </button>
              </div>
            )}
          </div>

          {/* ================= PROFILE ================= */}

          <div
            ref={profileRef}
            className="
            relative
            "
          >
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="
              h-12
              px-3
              shrink-0
              rounded-2xl
              bg-gradient-to-r
             from-emerald-600
             to-teal-600
              text-white
              flex
              items-center
              gap-3
              shadow-lg
              "
            >
              <div
                className="
                w-9
                h-9
                rounded-xl
                bg-white/20
                flex
                items-center
                justify-center
                font-bold
                "
              >
                {admin?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div
                className="
                text-left
                max-w-[130px]
                "
              >
                <p
                  className="
                  text-[11px]
                  opacity-80
                  "
                >
                  Administrator
                </p>

                <p
                  className="
                  text-sm
                  font-semibold
                  truncate
                  "
                  title={admin?.name}
                >
                  {admin?.name}
                </p>
              </div>

              <ChevronDown size={16} />
            </button>

            {profileOpen && (
              <div
                className="
                absolute
                right-0
                mt-3
                w-[310px]
                rounded-3xl
                bg-white
                border
                border-slate-200
                shadow-2xl
                p-5
                z-[9999]
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  mb-4
                  "
                >
                  <div
                    className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-emerald-100
                    flex
                    items-center
                    justify-center
                    text-emerald-700
                    font-bold
                    text-xl
                    "
                  >
                    {admin?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p
                      className="
                      font-bold
                      text-slate-900
                      "
                    >
                      {admin?.name}
                    </p>

                    <p
                      className="
                      text-sm
                      text-emerald-600
                      font-medium
                      "
                    >
                      Administrator
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-slate-900">
                  <button
                    onClick={() => {
                      setProfileOpen(false);

                      router.push("/admin/dashboard/profile");
                    }}
                    className="
                    w-full
                    h-11
                    rounded-2xl
                    flex
                    items-center
                    gap-2
                    px-4
                    hover:bg-emerald-50
                    text-slate-900
                    "
                  >
                    <User size={18} />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);

                      router.push("/admin/dashboard");
                    }}
                    className="
                    w-full
                    h-11
                    rounded-2xl
                    flex
                    items-center
                    gap-2
                    px-4
                    hover:bg-emerald-50
                    text-slate-900
                    "
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);

                      router.push("/admin/settings");
                    }}
                    className="
                    w-full
                    h-11
                    rounded-2xl
                    flex
                    items-center
                    gap-2
                    px-4
                    hover:bg-slate-50
                    "
                  >
                    <Settings size={18} className="text-emerald-700" />
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem("admin_token");

                      localStorage.removeItem("admin_data");

                      router.push("/admin/login");
                    }}
                    className="
                    w-full
                    h-11
                    rounded-2xl
                    flex
                    items-center
                    gap-2
                    px-4
                    text-red-600
                    hover:bg-red-50
                    "
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
