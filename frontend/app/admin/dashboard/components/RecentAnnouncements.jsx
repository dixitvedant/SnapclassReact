"use client";

import { motion } from "framer-motion";

import {
  Megaphone,
  CalendarDays,
} from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "Mid Semester Examination",
    date: "05 July 2026",
    description:
      "Mid semester examinations will begin from 15 July.",
  },
  {
    id: 2,
    title: "Faculty Meeting",
    date: "04 July 2026",
    description:
      "Department meeting scheduled at 3:00 PM.",
  },
  {
    id: 3,
    title: "Holiday Notice",
    date: "02 July 2026",
    description:
      "Institute will remain closed on Monday.",
  },
];

export default function RecentAnnouncements() {
  return (
    <div
      className="
      rounded-[30px]
      bg-white/75
      backdrop-blur-xl
      border
      border-white
      shadow-lg
      p-7
      h-full
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black text-slate-900">
            Recent Announcements
          </h2>

          <p className="mt-2 text-slate-500">
            Latest institute announcements
          </p>

        </div>

        <div
          className="
          h-14
          w-14
          rounded-2xl
          bg-violet-100
          flex
          items-center
          justify-center
          "
        >
          <Megaphone
            size={28}
            className="text-violet-600"
          />
        </div>

      </div>

      <div className="mt-8 space-y-5">

        {announcements.map((item) => (

          <motion.div
            key={item.id}
            whileHover={{ x: 5 }}
            className="
            rounded-2xl
            border
            border-slate-100
            p-5
            hover:bg-slate-50
            transition
            "
          >

            <h3 className="font-bold text-slate-900">
              {item.title}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">

              <CalendarDays size={15} />

              {item.date}

            </div>

            <p className="mt-3 text-sm text-slate-600 leading-6">
              {item.description}
            </p>

          </motion.div>

        ))}

      </div>

      <button
        className="
        mt-6
        w-full
        h-12
        rounded-2xl
        bg-violet-50
        text-violet-700
        font-semibold
        hover:bg-violet-100
        transition
        "
      >
        View All Announcements
      </button>

    </div>
  );
}