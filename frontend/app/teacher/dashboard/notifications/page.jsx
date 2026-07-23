"use client";

import { useEffect, useState } from "react";

import { Bell, Trash2, CheckCircle } from "lucide-react";

import toast from "react-hot-toast";

import TeacherAuthGuard from "../components/TeacherAuthGuard";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================
  // LOAD
  // =====================================
  const fetchNotifications = async () => {
    try {
      setLoading(true);

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
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.log(err);

      toast.error("Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =====================================
  // MARK READ
  // =====================================

  const markRead = async (id) => {
    const token = localStorage.getItem("teacher_token");

    await fetch(`http://127.0.0.1:8000/teacher-notifications/read/${id}`, {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Marked read");

    fetchNotifications();
  };

  // =====================================
  // DELETE
  // =====================================

  const deleteNotification = async (id) => {
    const token = localStorage.getItem("teacher_token");

    await fetch(`http://127.0.0.1:8000/teacher-notifications/delete/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Deleted");

    fetchNotifications();
  };

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-3xl
        font-black
        text-violet-700
        "
      >
        Loading Notifications.
      </div>
    );
  }

  return (
    <TeacherAuthGuard>
      <main
        className="
      min-h-screen
      bg-gradient-to-br
      from-violet-50
      via-fuchsia-50
      to-white
      p-8
      space-y-8
      "
      >
        {/* HEADER */}

        <div
          className="
        flex
        items-center
        gap-4
        "
        >
          <div
            className="
          w-14
          h-14
          rounded-3xl
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-500
          text-white
          flex
          items-center
          justify-center
          "
          >
            <Bell />
          </div>

          <div>
            <h1
              className="
            text-5xl
            font-black
            text-slate-900
            "
            >
              Notifications
            </h1>

            <p
              className="
            mt-2
            text-slate-500
            "
            >
              Teacher activity and system alerts
            </p>
          </div>
        </div>

        {/* LIST */}

        <div
          className="
        space-y-4
        "
        >
          {notifications.length === 0 ? (
            <div
              className="
            bg-white
            rounded-[35px]
            shadow-xl
            border
            border-violet-100
            p-10
            text-center
            text-slate-500
            "
            >
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.notification_id}
                className={`
                rounded-[35px]
                border
                shadow-xl
                p-6
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
                bg-white

                ${
                  n.delivery_status !== "read"
                    ? "border-violet-300"
                    : "border-slate-100"
                }
                `}
              >
                <div>
                  <div
                    className="
                    flex
                    items-center
                    gap-2
                    "
                  >
                    <h2
                      className="
                      text-xl
                      font-black
                      text-slate-900
                      "
                    >
                      {n.title}
                    </h2>

                    {n.delivery_status !== "read" && (
                      <span
                        className="
                        px-3
                        py-1
                        rounded-full
                        bg-red-100
                        text-red-600
                        text-xs
                        font-bold
                        "
                      >
                        NEW
                      </span>
                    )}
                  </div>

                  <p
                    className="
                    mt-2
                    text-slate-600
                    "
                  >
                    {n.message}
                  </p>

                  <p
                    className="
                    mt-2
                    text-xs
                    text-slate-400
                    "
                  >
                    {new Date(n.created_at).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>
                </div>

                <div
                  className="
                  flex
                  gap-3
                  "
                >
                  {n.delivery_status !== "read" && (
                    <button
                      onClick={() => markRead(n.notification_id)}
                      className="
                      h-11
                      px-4
                      rounded-2xl
                      bg-emerald-100
                      text-emerald-700
                      flex
                      items-center
                      gap-2
                      font-semibold
                      "
                    >
                      <CheckCircle size={16} />
                      Read
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(n.notification_id)}
                    className="
                    h-11
                    px-4
                    rounded-2xl
                    bg-red-100
                    text-red-600
                    flex
                    items-center
                    gap-2
                    font-semibold
                    "
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </TeacherAuthGuard>
  );
}
