"use client";

import { useEffect, useState } from "react";

import StudentTopbar from "../components/StudentTopbar";
import NotificationCard from "../components/NotificationCard";
import AuthGuard from "../components/AuthGuard";
import { apiFetch } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("student_id");

    if (!id) return;

    setStudentId(id);

    loadNotifications(id);
  }, []);

  async function loadNotifications(id) {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN =", token);

      const res = await apiFetch(`/student-notifications/${id}`);

      const result = await res.json();

      console.log(result);

      if (result.success) {
        setNotifications(result.notifications);
      }
    } catch (error) {
      console.error("Notification Error:", error);
    }
  }

  return (
    <AuthGuard>
      <StudentTopbar name="Student" studentId={studentId} />

      <h2
        className="
        text-4xl
        font-black
        mb-6
        text-slate-900
      "
      >
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <div
          className="
          bg-white
          rounded-3xl
          shadow-lg
          p-10
          text-center
          text-slate-500
        "
        >
          No Notifications Found
        </div>
      ) : (
        <div className="space-y-5">
          {notifications.map((item) => (
            <NotificationCard
              key={item.notification_id}
              title={item.title}
              message={item.message}
              status={item.delivery_status}
              createdAt={new Date(item.created_at).toLocaleString()}
            />
          ))}
        </div>
      )}
    </AuthGuard>
  );
}
