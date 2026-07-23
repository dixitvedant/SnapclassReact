"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Bell, User, Eye } from "lucide-react";
import { LogOut } from "lucide-react";

import Link from "next/link";

export default function StudentTopbar({ name, studentId }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    try {
      const studentId = localStorage.getItem("student_id");

      if (!studentId) return;

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://127.0.0.1:8000/student-notifications/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await res.json();

      if (result.success) {
        setNotifications(result.notifications || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div
      className="
      bg-white
      rounded-[32px]
      shadow-xl
      px-8
      py-5
      flex
      justify-between
      items-center
      mb-8
      text-slate-900
      "
    >
      {/* LEFT */}

      <div className="flex items-center gap-4">
        <div
          className="
          w-14
          h-14
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          text-white
          flex
          items-center
          justify-center
          "
        >
          <GraduationCap size={24} />
        </div>

        <div>
          <h2
            className="
            text-2xl
            font-bold
            text-slate-900
            "
          >
            Hello, {name}
          </h2>

          <p
            className="
            text-sm
            text-slate-500
            "
          >
            Student ID : {studentId}
          </p>
        </div>
      </div>

      {/* RIGHT */}

      <div
        className="
        flex
        items-center
        gap-3
        relative
        "
      >
        {/* PROFILE */}

        <Link
          href="/student/profile"
          className="
          w-12
          h-12
          rounded-2xl
          bg-slate-100
          flex
          items-center
          justify-center
          hover:bg-slate-200
          transition
          "
        >
          <User size={20} />
        </Link>

        {/* BELL */}

        <button
          onClick={() => {
            if (!showNotifications) {
              loadNotifications();
            }

            setShowNotifications(!showNotifications);
          }}
          className="
            w-12
            h-12
            rounded-2xl
            bg-blue-100
            text-blue-600
            flex
            items-center
            justify-center
            relative
            "
        >
          <Bell size={20} />

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
          text-xs
          flex
          items-center
          justify-center
          "
          >
            {notifications.length}
          </span>
        </button>
        <button
          onClick={() => {
            localStorage.clear();

            window.location.href = "/student/login";
          }}
        >
          <LogOut />
        </button>

        {/* NOTIFICATION POPUP */}

        {showNotifications && (
          <div
            className="
            absolute
            top-16
            right-0
            w-[350px]
            bg-white
            rounded-[28px]
            shadow-2xl
            border
            border-slate-200
            z-50
            overflow-hidden
            trasition
            hover:bg-slate-50
            "
          >
            <div
              className="
              px-5
              py-4
              border-b
              font-bold
              text-slate-900
              "
            >
              Notifications
            </div>

            <div className="p-4 space-y-3">
              {loading ? (
                <p
                  className="
      text-center
      text-slate-500
      "
                >
                  Loading...
                </p>
              ) : notifications.length === 0 ? (
                <p
                  className="
      text-center
      text-slate-500
      "
                >
                  No Notifications
                </p>
              ) : (
                notifications.slice(0, 5).map((item) => (
                  <div
                    key={item.notification_id}
                    className="
        p-4
        rounded-2xl
        bg-slate-50
        "
                  >
                    <p
                      className="
          font-semibold
          text-slate-900
          "
                    >
                      {item.title}
                    </p>

                    <p
                      className="
          text-sm
          text-slate-500
          mt-1
          line-clamp-2
          "
                    >
                      {item.message}
                    </p>
                    <p
                      className="
  text-xs
  text-slate-400
  mt-2
  "
                    >
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div
              className="
              border-t
              p-3
              "
            >
              <Link
                href="/student/notifications"
                className="
                w-full
                h-11
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                flex
                items-center
                justify-center
                gap-2
                font-semibold
                "
              >
                <Eye size={18} />
                View All
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
