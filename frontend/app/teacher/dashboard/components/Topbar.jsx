"use client";

import {
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Mail,
} from "lucide-react";

import { useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  const bellRef = useRef(null);

  const profileRef = useRef(null);

  const [teacher, setTeacher] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const [bellOpen, setBellOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  // LOAD

  useEffect(() => {
    const loadData = async () => {
      const t = JSON.parse(localStorage.getItem("teacher_data"));

      if (!t) return;

      setTeacher(t);

      try {
        const token = localStorage.getItem("teacher_token");

        const res = await fetch(
          "http://127.0.0.1:8000/teacher-notifications/teacher",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (data.success) {
          setNotifications(data.notifications?.slice(0, 5) || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  // OUTSIDE CLICK

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
  const firstName = teacher?.name?.split(" ")[0] || "Teacher";

  return (
    <header className="pt-5 relative z-[999]">
      <div
        className="
        w-full
        rounded-[34px]
        bg-white/75
        backdrop-blur-3xl
        border
        border-white/60
        shadow-[0_12px_40px_rgba(0,0,0,.08)]
        px-6
        py-5
        flex
        items-center
        justify-between
        gap-5
        "
      >
        {/* LEFT */}

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
  text-slate-900
  truncate
  max-w-[500px]
  "
            title={teacher?.name}
          >
            Welcome, {firstName}
          </h2>

          <p
            className="
            text-slate-500
            text-sm
            mt-1
            "
          >
            SmartAttend ERP Dashboard
          </p>
        </div>

        {/* RIGHT */}

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
            bg-slate-50
            border
            border-slate-200
            w-[320px]
            "
          >
            <Search
              size={18}
              className="
              text-slate-400
              "
            />

            <input
              placeholder="
              Search dashboard...
              "
              className="
              bg-transparent
              outline-none
              flex-1
              text-sm
              "
            />
          </div>

          {/* BELL */}

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
              bg-white
              border
              border-slate-200
              shadow-sm
              flex
              items-center
              justify-center
              hover:bg-violet-50
              transition
              "
            >
              <Bell
                size={20}
                className="
                text-slate-700
                "
              />

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

            {/* DROPDOWN */}

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
                    <p
                      className="
                          text-slate-400
                          "
                    >
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.notification_id}
                        className="
                              p-3
                              rounded-2xl
                              bg-violet-50
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
                  onClick={() =>
                    router.push("/teacher/dashboard/notifications")
                  }
                  className="
                    mt-4
                    w-full
                    h-11
                    rounded-2xl
                    bg-violet-600
                    text-white
                    font-semibold
                    "
                >
                  View All
                </button>
              </div>
            )}
          </div>

          {/* PROFILE */}

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
              from-violet-600
              to-purple-500
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
                {teacher?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div
                className="
                text-left
                max-w-[120px]

                "
              >
                <p
                  className="
                  text-[11px]
                  opacity-80
                  "
                >
                  Teacher
                </p>

                <p
                  className="
  text-sm
  font-semibold
  truncate
  "
                  title={teacher?.name}
                >
                  {teacher?.name}
                </p>
              </div>

              <ChevronDown size={16} />
            </button>

            {/* PROFILE DROPDOWN */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-[300px]
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
                      bg-violet-100
                      flex
                      items-center
                      justify-center
                      text-violet-700
                      font-bold
                      text-xl
                      "
                  >
                    {teacher?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p
                      className="
                        font-bold
                        text-slate-900
                        "
                    >
                      {teacher?.name}
                    </p>

                    <p
                      className="
                        text-sm
                        text-slate-500
                        "
                    >
                      ID: {teacher?.teacher_id}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    space-y-2
                    "
                >
                  <button
                    onClick={() => {
                      setProfileOpen(false);

                      router.push("/teacher/dashboard/profile");
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
                      text-slate-900
                      "
                  >
                    <User size={18} />
                    Profile
                  </button>

                  <button
                    onClick={() => router.push("/teacher/dashboard")}
                    className="
                      w-full
                      h-11
                      rounded-2xl
                      flex
                      items-center
                      gap-2
                      px-4
                      hover:bg-slate-50
                      text-slate-900
                      "
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      localStorage.clear();

                      router.push("/teacher/login");
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
