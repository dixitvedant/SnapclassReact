"use client";

import {
  TriangleAlert,
} from "lucide-react";

const students = [
  {
    name: "Rahul Sharma",
    attendance: "68%",
  },
  {
    name: "Aman Patel",
    attendance: "71%",
  },
  {
    name: "Sneha Joshi",
    attendance: "62%",
  },
  {
    name: "Rohit Singh",
    attendance: "70%",
  },
];

export default function DefaultersSummary() {
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
            Defaulters Summary
          </h2>

          <p className="mt-2 text-slate-500">
            Attendance below 75%
          </p>

        </div>

        <div
          className="
          h-14
          w-14
          rounded-2xl
          bg-amber-100
          flex
          items-center
          justify-center
          "
        >
          <TriangleAlert
            className="text-amber-600"
            size={28}
          />
        </div>

      </div>

      <div className="mt-8 space-y-4">

        {students.map((student) => (

          <div
            key={student.name}
            className="
            flex
            items-center
            justify-between
            rounded-2xl
            bg-slate-50
            p-4
            "
          >

            <span className="font-semibold text-slate-800">
              {student.name}
            </span>

            <span
              className="
              rounded-xl
              bg-red-100
              px-3
              py-1
              text-sm
              font-bold
              text-red-600
              "
            >
              {student.attendance}
            </span>

          </div>

        ))}

      </div>

      <button
        className="
        mt-6
        w-full
        h-12
        rounded-2xl
        bg-amber-50
        text-amber-700
        font-semibold
        hover:bg-amber-100
        transition
        "
      >
        View Complete Report
      </button>

    </div>
  );
}