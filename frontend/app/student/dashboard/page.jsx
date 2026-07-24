"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

import StudentTopbar from "../components/StudentTopbar";
import MetricCard from "../components/MetricCard";
import AuthGuard from "../components/AuthGuard";

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  const [enrollModal, setEnrollModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const [subjectCode, setSubjectCode] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const studentId = localStorage.getItem("student_id");

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token Missing");
      return;
    }

    console.log(token);

    const res = await apiFetch(`/dashboard/${studentId}`);

    const result = await res.json();

    console.log(result);

    if (result.success) {
      setData(result.dashboard);
    } else {
      toast.error(result.message);
    }
  }

  async function enrollSubject() {
    const studentId = localStorage.getItem("student_id");

    if (!subjectCode) {
      toast.error("Enter Subject Code");
      return;
    }

    const res = await apiFetch("/enroll/code", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        subject_code: subjectCode,
      }),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Enrolled Successfully");

      setEnrollModal(false);

      setSubjectCode("");

      loadDashboard();
    } else {
      toast.error(result.message);
    }
  }

  async function unEnroll(subjectId) {
    const studentId = localStorage.getItem("student_id");

    const res = await apiFetch("/unenroll/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        subject_id: subjectId,
      }),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Subject Removed");

      loadDashboard();
    } else {
      toast.error(result.message);
    }
  }

  if (!data) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-2xl
        font-bold
        text-slate-700
      "
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <AuthGuard>
      <StudentTopbar name={data.name} studentId={data.student_id} />

      {/* METRICS */}

      <div
        className="
        grid
        md:grid-cols-4
        gap-6
        mb-8
      "
      >
        <MetricCard title="Subjects" value={data.subjects} />

        <MetricCard title="Classes" value={data.total_classes} />

        <MetricCard title="Attended" value={data.attended_classes} />

        <MetricCard title="Attendance" value={`${data.attendance}%`} />
      </div>

      {/* SUBJECTS HEADER */}

      <div
        className="
        flex
        justify-between
        items-center
        mb-6
      "
      >
        <h2
          className="
          text-4xl
          font-black
          text-slate-900
        "
        >
          Enrolled Subjects
        </h2>

        <button
          onClick={() => setEnrollModal(true)}
          className="
          px-6
          h-14
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          text-white
          font-semibold
          flex
          items-center
          gap-2
          shadow-lg
        "
        >
          <Plus size={18} />
          Enroll Subject
        </button>
      </div>

      {/* SUBJECTS */}

      {/* SUBJECTS */}

      <div
        className="
  grid
  md:grid-cols-2
  xl:grid-cols-3
  gap-6
"
      >
        {data.subjects_list.map((item) => (
          <div
            key={item.subject.subject_id}
            className="
      bg-white
      rounded-[34px]
      shadow-xl
      overflow-hidden
      hover:-translate-y-2
      hover:shadow-2xl
      transition
    "
          >
            <div
              className="
        h-2
        bg-gradient-to-r
        from-blue-600
        to-cyan-500
      "
            />

            <div className="p-6">
              <h3
                className="
          text-3xl
          font-black
          text-slate-900
        "
              >
                {item.subject.name}
              </h3>

              <p
                className="
          text-slate-500
          mt-2
          mb-6
        "
              >
                {item.subject.subject_code}
                {" • "}
                {item.subject.section}
              </p>

              <div className="space-y-3">
                <Link
                  href={`/student/subjects/${item.subject.subject_id}`}
                  className="
            w-full
            h-12
            rounded-2xl
            bg-blue-100
            text-blue-700
            font-semibold
            flex
            items-center
            justify-center
            hover:bg-blue-200
            transition
          "
                >
                  View Subject
                </Link>

                <button
                  onClick={() => {
                    setSelectedSubjectId(item.subject.subject_id);

                    setConfirmModal(true);
                  }}
                  className="
            w-full
            h-12
            rounded-2xl
            bg-rose-100
            text-rose-600
            font-semibold
            hover:bg-rose-200
            transition
          "
                >
                  Unenroll
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UNENROLL MODAL */}

      {confirmModal && (
        <div
          className="
          fixed
          inset-0
          z-50
          bg-black/30
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-4
        "
        >
          <div
            className="
            bg-white
            rounded-[38px]
            shadow-2xl
            w-full
            max-w-md
            p-8
          "
          >
            <h2
              className="
              text-3xl
              font-black
              mb-3
              text-slate-900
            "
            >
              Unenroll Subject
            </h2>

            <p
              className="
              text-slate-500
              mb-7
            "
            >
              Do you really want to unenroll from this subject?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(false)}
                className="
                flex-1
                h-12
                rounded-2xl
                bg-slate-100
                text-slate-900
                transition
                hover:bg-slate-200
              "
              >
                No
              </button>

              <button
                onClick={() => {
                  setConfirmModal(false);

                  unEnroll(selectedSubjectId);
                }}
                className="
                flex-1
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-red-500
                to-rose-500
                text-white
              "
              >
                Yes, Unenroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLL MODAL */}

      {enrollModal && (
        <div
          className="
          fixed
          inset-0
          z-50
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-4
        "
        >
          <div
            className="
            bg-white
            rounded-[40px]
            shadow-2xl
            w-full
            max-w-xl
            p-8
          "
          >
            <div
              className="
              flex
              justify-between
              items-center
              mb-6
            "
            >
              <h2
                className="
                text-4xl
                font-black
                text-slate-900
              "
              >
                Enroll Subject
              </h2>

              <button
                onClick={() => setEnrollModal(false)}
                className="
                w-12
                h-12
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                flex
                items-center
                justify-center
              "
              >
                <X size={22} />
              </button>
            </div>

            <input
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="Enter Subject Code"
              className="
              w-full
              h-14
              rounded-2xl
              border-2
              border-blue-500
              px-5
              text-slate-900
              
            "
            />

            <button
              onClick={enrollSubject}
              className="
              w-full
              h-14
              rounded-2xl
              mt-5
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              font-semibold
            "
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
