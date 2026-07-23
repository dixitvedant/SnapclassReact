"use client";

import { useEffect, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AuthGuard from "../components/AuthGuard";

export default function StudentCalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState([]);

  useEffect(() => {
    loadCalendar();
  }, []);

  async function loadCalendar() {
    try {
      const studentId = localStorage.getItem("student_id");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://127.0.0.1:8000/student-calendar/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await res.json();

      if (result.success) {
        setEvents(result.calendar);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const attendanceMap = {};

  events.forEach((row) => {
    const day = new Date(row.timestamp).toISOString().split("T")[0];

    if (!attendanceMap[day]) {
      attendanceMap[day] = [];
    }

    attendanceMap[day].push(row);
  });

  return (
    <AuthGuard>
      <div
        className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-blue-50
      to-cyan-50
      p-8
      text-slate-900
    "
      >
        {/* HEADER */}

        <div
          className="
        mb-8
      "
        >
          <h1
            className="
          text-5xl
          font-black
          text-slate-900
        "
          >
            Attendance Calendar
          </h1>

          <p
            className="
          mt-2
          text-lg
          text-slate-500
        "
          >
            Track your attendance history
          </p>
        </div>

        {/* CALENDAR CARD */}

        <div
          className="
        bg-white
        rounded-[40px]
        shadow-2xl
        border
        border-slate-100
        p-8
        mb-8
      "
        >
          <Calendar
            onClickDay={(date) => {
              const day = date.toISOString().split("T")[0];

              setSelectedDay(attendanceMap[day] || []);
            }}
            tileClassName={({ date }) => {
              const day = date.toISOString().split("T")[0];

              const records = attendanceMap[day];

              if (!records) return null;

              const hasAbsent = records.some((x) => !x.is_present);

              if (hasAbsent) return "absent-day";

              return "present-day";
            }}
          />

          {/* LEGEND */}

          <div
            className="
          flex
          gap-8
          mt-8
          text-sm
          font-semibold
        "
          >
            <div
              className="
            flex
            items-center
            gap-2
          "
            >
              <div
                className="
              w-4
              h-4
              rounded-full
              bg-green-500
            "
              />
              Present
            </div>

            <div
              className="
            flex
            items-center
            gap-2
          "
            >
              <div
                className="
              w-4
              h-4
              rounded-full
              bg-red-500
            "
              />
              Absent
            </div>
          </div>
        </div>

        {/* DETAILS CARD */}

        {selectedDay.length > 0 && (
          <div
            className="
          bg-white
          rounded-[40px]
          shadow-xl
          border
          border-slate-100
          p-8
        "
          >
            <h2
              className="
            text-3xl
            font-black
            text-slate-900
            mb-6
          "
            >
              Attendance Details
            </h2>

            <div
              className="
            space-y-4
          "
            >
              {selectedDay.map((item) => (
                <div
                  key={item.id}
                  className="
                flex
                justify-between
                items-center
                p-5
                rounded-3xl
                border
                border-slate-200
                hover:bg-slate-50
                transition
              "
                >
                  <div>
                    <h3
                      className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                    >
                      {item.subject?.name}
                    </h3>

                    <p
                      className="
                    text-slate-500
                    mt-1
                  "
                    >
                      Subject Code : {item.subject?.subject_code}
                    </p>

                    <p
                      className="
                    text-slate-400
                    text-sm
                    mt-1
                  "
                    >
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`
                  px-5
                  py-2
                  rounded-full
                  font-bold

                  ${
                    item.is_present
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
                  >
                    {item.is_present ? "Present" : "Absent"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
