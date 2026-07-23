"use client";

import { Bell } from "lucide-react";

export default function NotificationCard({
  title,
  message,
  createdAt,
  status,
}) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      shadow-lg
      p-6
      border-l-4
      border-blue-500
    "
    >
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Bell className="text-blue-600" />

          <div>
            <h3 className="font-bold text-xl text-slate-900">{title}</h3>
            <div
              className="mt-2 text-slate-700"
              dangerouslySetInnerHTML={{
                __html: message,
              }}
            />{" "}
          </div>
        </div>

        <span
          className={`
          px-3
          py-1
          rounded-full
          text-sm
          ${
            status === "unread"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }
        `}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 text-sm text-slate-400">{createdAt}</div>
    </div>
  );
}
