"use client";
import TeacherAuthGuard from "./components/TeacherAuthGuard";

import DashboardCards from "./components/DashboardCards";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { CalendarClock, Bell, Megaphone, Camera } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [lectures, setLectures] = useState([]);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("teacher_token");

        if (!token) return;

        // LECTURES

        const lectureRes = await fetch(
          "http://127.0.0.1:8000/lecture-management/teacher?limit=5",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const lectureData = await lectureRes.json();

        // NOTIFICATIONS
        
        const notifRes = await fetch(
          "http://127.0.0.1:8000/teacher-notifications/teacher",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const notifData = await notifRes.json();

        if (lectureData.success) {
          setLectures(lectureData.sessions || []);
        }

        if (notifData.success) {
          setNotifications(notifData.notifications?.slice(0, 5) || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  return (
    <TeacherAuthGuard>
      <div
        className="
      w-full
      space-y-6
      overflow-x-hidden
      "
      >
        <DashboardCards />

        {/* QUICK ACTIONS */}

        <div
          className="
        grid
        md:grid-cols-4
        gap-4
        "
        >
          <button
            onClick={() => router.push("/teacher/dashboard/attendance")}
            className="
          h-24
          rounded-[28px]
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-500
          text-white
          font-bold
          shadow-lg
          hover:scale-[1.02]
          transition
                    text-slate-900

          "
          >
            Take Attendance
          </button>

          <button
            onClick={() => router.push("/teacher/dashboard/lectures")}
            className="
          h-24
          rounded-[28px]
          bg-white/75
          border
          border-violet-100
          shadow-lg
          font-semibold
          hover:bg-violet-50
          transition
          text-slate-900
          "
          >
            Lectures
          </button>

          <button
            onClick={() => router.push("/teacher/dashboard/announcements")}
            className="
          h-24
          rounded-[28px]
          bg-white/75
          border
          border-violet-100
          shadow-lg
          font-semibold
          hover:bg-violet-50
          transition
          text-slate-900

          "
          >
            Announcement
          </button>

          <button
            onClick={() => router.push("/teacher/dashboard/notifications")}
            className="
          h-24
          rounded-[28px]
          bg-white/75
          border
          border-violet-100
          shadow-lg
          font-semibold
          hover:bg-violet-50
          transition
          text-slate-900
          "
          >
            Notifications
          </button>
        </div>

        {/* PANELS */}

        <div
          className="
        grid
        lg:grid-cols-2
        gap-6
        "
        >
          {/* RECENT LECTURES */}

          <div
            className="
          rounded-[36px]
          h-[420px]
          overflow-y-auto
          bg-white/75
          backdrop-blur-3xl
          border
          border-white/60
          shadow-lg
          p-6
          "
          >
            <div
              className="
            flex
            items-center
            gap-3
            mb-6
            "
            >
              <CalendarClock
                className="
              text-violet-600
              "
              />

              <h2
                className="
              text-2xl
              font-black
              text-slate-900
              "
              >
                Recent Lectures
              </h2>
            </div>

            <div
              className="
            space-y-3
            "
            >
              {lectures.length === 0 ? (
                <p
                  className="
                text-slate-400
                "
                >
                  No lectures
                </p>
              ) : (
                lectures.map((l) => (
                  <div
                    key={l.session_id}
                    className="
                    p-4
                    rounded-2xl
                    bg-violet-50
                    border
                    border-violet-100
                    "
                  >
                    <p
                      className="
                      font-semibold
                      text-slate-900
                      "
                    >
                      {l.subject?.name}
                    </p>

                    <p
                      className="
                      text-sm
                      text-slate-500
                      mt-1
                      "
                    >
                      {new Date(l.lecture_time).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* NOTIFICATIONS */}

          <div
            className="
          rounded-[36px]
          h-[420px]
          overflow-y-auto
          bg-white/75
          backdrop-blur-3xl
          border
          border-white/60
          shadow-lg
          p-6
          "
          >
            <div
              className="
            flex
            items-center
            gap-3
            mb-6
            "
            >
              <Bell
                className="
              text-fuchsia-600
              "
              />

              <h2
                className="
              text-2xl
              font-black
              text-slate-900
              "
              >
                Notifications
              </h2>
            </div>

            <div
              className="
            space-y-3
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
                    p-4
                    rounded-2xl
                    bg-fuchsia-50
                    border
                    border-fuchsia-100
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
                      mt-1
                      "
                    >
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </TeacherAuthGuard>
  );
}
