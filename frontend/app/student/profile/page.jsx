"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { User, Mail, Phone, ShieldCheck, ScanFace, Mic } from "lucide-react";

import StudentTopbar from "../components/StudentTopbar";
import AuthGuard from "../components/AuthGuard";

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [studentEmail, setStudentEmail] = useState("");

  const [parentEmail, setParentEmail] = useState("");

  const [parentMobile, setParentMobile] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const studentId = localStorage.getItem("student_id");

    const token = localStorage.getItem("token");

const res = await fetch(
  `http://127.0.0.1:8000/student-profile/${studentId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
    const result = await res.json();

    if (result.success) {
      setData(result.student);

      setStudentEmail(result.student.student_email || "");

      setParentEmail(result.student.parent_email || "");

      setParentMobile(result.student.parent_mobile || "");
    }
  }

  async function saveProfile() {
    const studentId = localStorage.getItem("student_id");

   const token =
  localStorage.getItem("token");

const res = await fetch(
  `http://127.0.0.1:8000/student-profile/update/${studentId}`,
  {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",

      Authorization:
        `Bearer ${token}`
    },

    body: JSON.stringify({
      student_email: studentEmail,
      parent_email: parentEmail,
      parent_mobile: parentMobile,
    }),
  },
);
    const result = await res.json();

    if (result.success) {
      toast.success("Profile Updated");

      setEditMode(false);

      loadProfile();
    } else {
      toast.error("Update Failed");
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Profile...
      </div>
    );
  }

  return (
    <AuthGuard>
      <StudentTopbar name={data.name} studentId={data.student_id} />

      <div className="space-y-8">
        {/* HERO CARD */}

        <div
          className="
          bg-white
          rounded-[40px]
          shadow-xl
          overflow-hidden
        "
        >
          <div
            className="
            h-40
            bg-gradient-to-r
            from-blue-600
            via-cyan-500
            to-indigo-600
          "
          />

          <div className="px-8 pb-8 relative">
            <div
              className="
              absolute
              -top-16
              w-32
              h-32
              rounded-full
              bg-white
              shadow-xl
              border-4
              border-white
              flex
              items-center
              justify-center
            "
            >
              <User size={55} className="text-blue-600" />
            </div>

            <div className="pt-20">
              <h1
                className="
                text-4xl
                font-black
                text-slate-900
              "
              >
                {data.name}
              </h1>

              <p className="text-slate-500 mt-2">
                Student ID : {data.student_id}
              </p>

              <div
                className="
                mt-4
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-emerald-100
                text-emerald-700
                font-semibold
              "
              >
                <ShieldCheck size={18} />
                Active Student
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <button
            onClick={() => setEditMode(true)}
            className="
            px-6
            h-12
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-semibold
            "
          >
            Edit Profile
          </button>
        </div>

        {/* CONTACT INFO */}

        <div
          className="
          grid
          md:grid-cols-2
          gap-6
        "
        >
          <InfoCard
            icon={<Mail />}
            title="Student Email"
            value={data.student_email}
          />

          <InfoCard
            icon={<Mail />}
            title="Parent Email"
            value={data.parent_email}
          />

          <InfoCard
            icon={<Phone />}
            title="Parent Mobile"
            value={data.parent_mobile}
          />

          <InfoCard
            icon={<User />}
            title="Student ID"
            value={data.student_id}
          />
        </div>

        {/* BIOMETRIC STATUS */}

        <div
          className="
          grid
          md:grid-cols-2
          gap-6
        "
        >
          <StatusCard
            title="Face Recognition"
            status={!!data.face_embedding}
            icon={<ScanFace size={28} />}
          />

          <StatusCard
            title="Voice Recognition"
            status={!!data.voice_embedding}
            icon={<Mic size={28} />}
          />
        </div>
      </div>
      {editMode && (
        <div
          className="
    fixed
    inset-0
    z-50
    bg-black/40
    backdrop-blur-sm
    flex
    items-center
    justify-center
    text-slate-900
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
            <h2
              className="
        text-4xl
        font-black
        mb-6
        "
            >
              Edit Profile
            </h2>

            <input
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="Student Email"
              className="
        w-full
        h-14
        border
        rounded-2xl
        px-4
        mb-4
        text-slate-900
        "
            />

            <input
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="Parent Email"
              className="
        w-full
        h-14
        border
        rounded-2xl
        px-4
        mb-4
                text-slate-900

        "
            />

            <input
              value={parentMobile}
              onChange={(e) => setParentMobile(e.target.value)}
              placeholder="Parent Mobile"
              className="
        w-full
        h-14
        border
        rounded-2xl
        px-4
        mb-6
        "
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(false)}
                className="
          flex-1
          h-12
          rounded-2xl
          bg-slate-200
          transition
          hover:bg-slate-400
          "
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="
          flex-1
          h-12
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          text-white
          text-slate-900
          transition
            hover:from-blue-700
            hover:to-cyan-600
            
          "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div
      className="
      bg-white
      rounded-[30px]
      shadow-lg
      p-6
      flex
      gap-4
      items-center
    "
    >
      <div
        className="
        w-14
        h-14
        rounded-2xl
        bg-blue-100
        text-blue-600
        flex
        items-center
        justify-center
      "
      >
        {icon}
      </div>

      <div>
        <p className="text-slate-500">{title}</p>

        <h3
          className="
          font-bold
          text-slate-900
        "
        >
          {value || "Not Available"}
        </h3>
      </div>
    </div>
  );
}

function StatusCard({ title, status, icon }) {
  return (
    <div
      className="
      bg-white
      rounded-[30px]
      shadow-lg
      p-6
    "
    >
      <div className="flex items-center gap-4">
        <div
          className="
          w-14
          h-14
          rounded-2xl
          bg-blue-100
          text-blue-600
          flex
          items-center
          justify-center
        "
        >
          {icon}
        </div>

        <div>
          <h3
            className="
            text-xl
            font-bold
            text-slate-900
          "
          >
            {title}
          </h3>

          <p
            className={
              status
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {status ? "Registered" : "Not Registered"}
          </p>
        </div>
      </div>
    </div>

  );
}
