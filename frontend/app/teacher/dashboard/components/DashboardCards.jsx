"use client";

import { useEffect, useState } from "react";

import { Users, BookOpen, TrendingUp, AlertTriangle } from "lucide-react";

export default function DashboardCards() {
  const [dashboard, setDashboard] = useState({
    students: 0,
    classes: 0,
    average: 0,
    below75: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("teacher_token");

        if (!token) return;

        const res = await fetch("http://127.0.0.1:8000/attendance/teacher", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log(data);

        if (data.success) {
          setDashboard(data.dashboard);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Students",

      value: dashboard.students,

      icon: Users,
    },

    {
      title: "Subjects",
      value: dashboard.subjects,
      icon: BookOpen,
    },

    {
      title: "Attendance %",

      value: `${dashboard.average}%`,

      icon: TrendingUp,
    },

    {
      title: "Below 75%",

      value: dashboard.below75,

      icon: AlertTriangle,
    },
  ];

  return (
    <div
      className="
      grid
      md:grid-cols-4
      gap-6
      "
    >
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <div
            key={i}
            className="
                rounded-[30px]
                bg-white/75
                backdrop-blur-3xl
                border
                border-white/60
                shadow-lg
                p-7
                hover:-translate-y-1
                transition
                "
          >
            <div
              className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-500
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-md
                  "
            >
              <Icon size={24} />
            </div>

            <p
              className="
                  text-slate-500
                  mt-5
                  "
            >
              {card.title}
            </p>

            <h3
              className="
                  text-4xl
                  font-black
                  mt-2
                  text-slate-900
                  "
            >
              {card.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
