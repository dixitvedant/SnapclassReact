"use client";

import { motion } from "framer-motion";

import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  CalendarClock,
  GraduationCap,
  UserPlus,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Attendance Completed",
    message: "Today's attendance has been submitted successfully.",
    icon: CheckCircle2,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
    time: "5 min ago",
  },
  {
    id: 2,
    title: "New Announcement",
    message: "Semester examination schedule published.",
    icon: Megaphone,
    bg: "bg-violet-100",
    color: "text-violet-600",
    time: "25 min ago",
  },
  {
    id: 3,
    title: "Low Attendance",
    message: "18 students are below 75% attendance.",
    icon: AlertTriangle,
    bg: "bg-amber-100",
    color: "text-amber-600",
    time: "1 hour ago",
  },
  {
    id: 4,
    title: "Lecture Scheduled",
    message: "New lecture timetable has been updated.",
    icon: CalendarClock,
    bg: "bg-sky-100",
    color: "text-sky-600",
    time: "Today",
  },
  {
    id: 5,
    title: "New Student",
    message: "A new student has been registered.",
    icon: GraduationCap,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
    time: "Today",
  },
  {
    id: 6,
    title: "Teacher Added",
    message: "Computer department faculty added.",
    icon: UserPlus,
    bg: "bg-blue-100",
    color: "text-blue-600",
    time: "Yesterday",
  },
];

export default function LatestNotifications() {
  return (
    <div
      className="
      h-[510px]
      rounded-[30px]
      bg-white/75
      backdrop-blur-xl
      border
      border-white
      shadow-lg
      p-7
      flex
      flex-col
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Notifications
          </h2>

          <p className="mt-2 text-slate-500">
            Latest institute activities
          </p>
        </div>

        <div
          className="
          h-14
          w-14
          rounded-2xl
          bg-emerald-100
          flex
          items-center
          justify-center
          "
        >
          <Bell
            size={28}
            className="text-emerald-600"
          />
        </div>
      </div>

      {/* Notification List */}

      <div
        className="
        mt-7
        flex-1
        overflow-y-auto
        space-y-4
        pr-2
        scrollbar-thin
        scrollbar-thumb-slate-300
        scrollbar-track-transparent
        "
      >
        {notifications.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              className="
              flex
              gap-4
              rounded-2xl
              p-3
              hover:bg-slate-50
              transition
              "
            >
              <div
                className={`
                h-12
                w-12
                rounded-xl
                flex
                items-center
                justify-center
                ${item.bg}
                `}
              >
                <Icon
                  size={22}
                  className={item.color}
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {item.message}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  {item.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}

      <button
        className="
        mt-6
        h-12
        rounded-2xl
        bg-emerald-50
        text-emerald-700
        font-semibold
        hover:bg-emerald-100
        transition
        "
      >
        View All Notifications
      </button>
    </div>
  );
}