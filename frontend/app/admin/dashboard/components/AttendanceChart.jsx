"use client";

import {
  BarChart3,
  TrendingUp,
} from "lucide-react";

export default function AttendanceChart() {
  return (
    <div
      className="
      h-full
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
      {/* ================= Header ================= */}

      <div className="flex items-center justify-between">

        <div>

          <h2
            className="
            text-2xl
            font-black
            text-slate-900
            "
          >
            Attendance Analytics
          </h2>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
            "
          >
            Monthly attendance overview
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
          <BarChart3
            className="text-emerald-600"
            size={28}
          />
        </div>

      </div>

      {/* ================= Fake Chart ================= */}

      <div
        className="
        flex-1
        mt-10
        flex
        items-end
        justify-between
        gap-4
        "
      >

        {[
          80,
          120,
          100,
          170,
          140,
          200,
          170,
        ].map((height, index) => (

          <div
            key={index}
            className="
            flex
            flex-col
            items-center
            gap-3
            flex-1
            "
          >

            <div
              className="
              w-full
              rounded-t-2xl
              bg-gradient-to-t
              from-emerald-600
              to-teal-400
              hover:from-teal-500
              hover:to-emerald-400
              transition-all
              duration-300
              "
              style={{
                height: `${height}px`,
              }}
            />

            <span
              className="
              text-sm
              font-semibold
              text-slate-500
              "
            >
              {
                ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index]
              }
            </span>

          </div>

        ))}

      </div>

      {/* ================= Footer ================= */}

      <div
        className="
        mt-8
        flex
        items-center
        justify-between
        border-t
        pt-5
        "
      >

        <div>

          <p
            className="
            text-sm
            text-slate-500
            "
          >
            Overall Attendance
          </p>

          <h2
            className="
            text-3xl
            font-black
            text-slate-900
            "
          >
            94%
          </h2>

        </div>

        <div
          className="
          flex
          items-center
          gap-2
          text-emerald-600
          font-bold
          "
        >

          <TrendingUp size={20} />

          +4.5%

        </div>

      </div>

    </div>
  );
}