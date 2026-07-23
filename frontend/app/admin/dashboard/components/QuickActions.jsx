"use client";

import { motion } from "framer-motion";

import {
  UserPlus,
  GraduationCap,
  BookOpen,
  Megaphone,
} from "lucide-react";

const actions = [
  {
    title: "Add Teacher",
    subtitle: "Register a new teacher",
    icon: UserPlus,
    bg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    title: "Add Student",
    subtitle: "Enroll a new student",
    icon: GraduationCap,
    bg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Add Subject",
    subtitle: "Create a new subject",
    icon: BookOpen,
    bg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Announcement",
    subtitle: "Send institute notice",
    icon: Megaphone,
    bg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

export default function QuickActions() {
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
      "
    >
      <div className="mb-8">

        <h2
          className="
          text-2xl
          font-black
          text-slate-900
          "
        >
          Quick Actions
        </h2>

        <p
          className="
          mt-2
          text-slate-500
          "
        >
          Frequently used administrative actions.
        </p>

      </div>

      <div
        className="
        grid
        grid-cols-2
        gap-5
        "
      >
        {actions.map((item) => {

          const Icon = item.icon;

          return (

            <motion.button
              key={item.title}

              whileHover={{
                y: -5,
                scale: 1.03,
              }}

              whileTap={{
                scale: 0.97,
              }}

              className="
              rounded-3xl
              border
              border-slate-100
              bg-slate-50
              p-5
              text-left
              hover:shadow-xl
              transition-all
              duration-300
              "
            >
              <div
                className={`
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                mb-5
                ${item.bg}
                `}
              >
                <Icon
                  size={28}
                  className={item.iconColor}
                />
              </div>

              <h3
                className="
                font-bold
                text-lg
                text-slate-900
                "
              >
                {item.title}
              </h3>

              <p
                className="
                mt-1
                text-sm
                text-slate-500
                "
              >
                {item.subtitle}
              </p>

            </motion.button>

          );

        })}
      </div>
    </div>
  );
}