"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MetricCard from "../../components/MetricCard";
import AuthGuard from "../../components/AuthGuard";
import { apiFetch } from "@/lib/api";

export default function SubjectDetailsPage() {
  const params = useParams();

  const subjectId = params.id;

  const [data, setData] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");

    if (!studentId) return;

    loadSubject(studentId);
  }, []);

  async function loadSubject(studentId) {
    const res = await apiFetch(`/student-subject/${studentId}/${subjectId}`);

    const result = await res.json();

    if (result.success) {
      setData(result);
    }
  }

  if (!data) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <AuthGuard>
      <div
        className="
    min-h-screen
    bg-slate-100
    p-8
    text-slate-900
  "
      >
        {/* SUBJECT HEADER */}

        <div
          className="
      bg-white
      rounded-[40px]
      shadow-xl
      p-8
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
            {data.subject.name}
          </h1>

          <p className="mt-3 text-slate-500">
            Subject Code :{data.subject.subject_code}
          </p>

          <p className="text-slate-500">Section :{data.subject.section}</p>
        </div>

        {/* METRICS */}

        <div
          className="
      grid
      md:grid-cols-4
      gap-6
      mb-8
    "
        >
          <MetricCard title="Total" value={data.total} />

          <MetricCard title="Present" value={data.present} />

          <MetricCard title="Absent" value={data.absent} />

          <MetricCard title="Attendance" value={`${data.percentage}%`} />
        </div>

        {/* PROGRESS */}

        <div
          className="
      bg-white
      rounded-3xl
      shadow-lg
      p-6
      mb-8
    "
        >
          <h2
            className="
        text-2xl
        font-bold
        mb-4
        text-slate-900
      "
          >
            Attendance Progress
          </h2>

          <div
            className="
        h-5
        rounded-full
        bg-slate-200
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

        {/* HISTORY TABLE */}

        <div
          className="
      bg-white
      rounded-3xl
      shadow-lg
      overflow-hidden
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

          <table
            className="
        w-full
      "
          >
            <thead
              className="
          bg-slate-100
        "
            >
              <tr>
                <th className="p-4 text-left">Date</th>

                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.attendance.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-4">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>

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
      </div>
    </AuthGuard>
  );
}
