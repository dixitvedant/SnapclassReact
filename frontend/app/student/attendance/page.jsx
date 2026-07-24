"use client";

import { useEffect, useState } from "react";

import StudentTopbar from "../components/StudentTopbar";
import MetricCard from "../components/MetricCard";
import AuthGuard from "../components/AuthGuard";
import { apiFetch } from "@/lib/api";

export default function AttendancePage() {
  const [data, setData] = useState(null);

  const [studentId, setStudentId] = useState("");

  const [subjectFilter, setSubjectFilter] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("student_id");

    if (!id) return;

    setStudentId(id);

    loadAttendance(id);

    loadSubjects();
  }, []);

  async function loadSubjects() {
    const id = localStorage.getItem("student_id");

    const res = await apiFetch(`/dashboard/${id}`);

    const result = await res.json();

    if (result.success) {
      setSubjects(result.dashboard.subjects_list);
    }
  }

  async function loadAttendance(id) {
    try {
      const res = await apiFetch(`/student-attendance/${id}`);

      if (!res.ok) {
        throw new Error("API Error");
      }

      const result = await res.json();

      if (result.success) {
        setData(result);
      }
    } catch (err) {
      console.error("Attendance Error:", err);
    }
  }

  if (!data) {
    return <div className="text-center p-10">Loading Attendance...</div>;
  }

  const filteredAttendance = data.attendance.filter((row) => {
    const rowDate = new Date(row.timestamp);

    const matchSubject =
      subjectFilter === "" || String(row.subject_id) === String(subjectFilter);

    const matchFrom = !fromDate || rowDate >= new Date(fromDate);

    const matchTo = !toDate || rowDate <= new Date(`${toDate}T23:59:59`);

    return matchSubject && matchFrom && matchTo;
  });

  return (
    <AuthGuard>
      <StudentTopbar name="Student" studentId={studentId} />

      {/* METRICS */}

      <div
        className="
        grid
        md:grid-cols-4
        gap-6
        mb-8
      "
      >
        <MetricCard title="Present" value={data.present} />

        <MetricCard title="Absent" value={data.absent} />

        <MetricCard title="Total Classes" value={data.total} />

        <MetricCard title="Attendance" value={`${data.percentage}%`} />
      </div>

      {/* PROGRESS BAR */}

      <div
        className="
        bg-white
        rounded-3xl
        shadow-lg
        p-6
        mb-8
      "
      >
        <h3
          className="
          text-2xl
          font-bold
          text-slate-900
          mb-4
        "
        >
          Attendance Progress
        </h3>

        <div
          className="
          w-full
          h-5
          bg-slate-200
          rounded-full
          overflow-hidden
        "
        >
          <div
            className="
            h-full
            bg-green-500
          "
            style={{
              width: `${data.percentage}%`,
            }}
          />
        </div>

        <p
          className="
          mt-3
          text-slate-600
        "
        >
          {data.percentage}% Attendance
        </p>
      </div>
      <div
        className="
  bg-white
  rounded-3xl
  shadow-lg
  p-6
  mb-6
  grid
  md:grid-cols-4
  gap-4
"
      >
        {/* Subject */}

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="
    h-12
    rounded-xl
    border
    px-4
    text-slate-800
  "
        >
          <option value="">All Subjects</option>

          {subjects.map((s) => (
            <option key={s.subject.subject_id} value={s.subject.subject_id}>
              {s.subject.name}
            </option>
          ))}
        </select>

        {/* From Date */}

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="
    h-12
    rounded-xl
    border
    px-4
    text-slate-800
  "
        />

        {/* To Date */}

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="
    h-12
    rounded-xl
    border
    px-4
    text-slate-800
  "
        />

        {/* Reset */}

        <button
          onClick={() => {
            setSubjectFilter("");
            setFromDate("");
            setToDate("");
          }}
          className="
    h-12
    rounded-xl
    bg-blue-600
    text-white
    font-semibold
  "
        >
          Reset Filters
        </button>
      </div>

      {/* TABLE */}

      <div
        className="
        bg-white
        rounded-3xl
        shadow-lg
        overflow-hidden
        text-slate-900
      "
      >
        <div
          className="
          px-6
          py-5
          border-b
          text-2xl
          font-bold
          text-slate-900
        "
        >
          Attendance History
        </div>

        <table className="w-full">
          <thead
            className="
            bg-slate-100
          "
          >
            <tr>
              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Subject</th>

              <th className="p-4 text-left">Code</th>

              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAttendance.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-4">
                  {new Date(row.timestamp).toLocaleString()}
                </td>

                <td className="p-4">{row.subject?.name}</td>

                <td className="p-4">{row.subject?.subject_code}</td>

                <td className="p-4">
                  {row.is_present ? (
                    <span
                      className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-100
                      text-green-700
                      font-semibold
                    "
                    >
                      Present
                    </span>
                  ) : (
                    <span
                      className="
                      px-3
                      py-1
                      rounded-full
                      bg-red-100
                      text-red-700
                      font-semibold
                    "
                    >
                      Absent
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthGuard>
  );
}
