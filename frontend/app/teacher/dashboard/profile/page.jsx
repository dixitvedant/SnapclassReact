"use client";

import { User, Mail, Shield, BookOpen, Edit3, Lock } from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import TeacherAuthGuard from "../components/TeacherAuthGuard";

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [form, setForm] = useState({
    name: "",

    email: "",

    mobile: "",

    department: "",

    qualification: "",
  });

  const [subjectCount, setSubjectCount] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      const t = JSON.parse(localStorage.getItem("teacher_data"));

      if (!t) return;

      setTeacher(t);
      const token = localStorage.getItem("teacher_token");

      const profileRes = await fetch("http://127.0.0.1:8000/teacher-profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const profileData = await profileRes.json();

      if (profileData.success) {
        setTeacher(profileData.teacher);

        setForm({
          name: profileData.teacher.name || "",

          email: profileData.teacher.email || "",

          mobile: profileData.teacher.mobile || "",

          department: profileData.teacher.department || "",

          qualification: profileData.teacher.qualification || "",
        });
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/attendance/teacher/${t.teacher_id}`,
        );

        const data = await res.json();

        if (data.success) {
          setSubjectCount(data.dashboard?.subjects || 0);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadProfile();
  }, []);
  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("teacher_token");

      const res = await fetch("http://127.0.0.1:8000/teacher-profile/", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        const updatedTeacher = {
          ...teacher,

          ...form,
        };

        setTeacher(updatedTeacher);

        localStorage.setItem(
          "teacher_data",

          JSON.stringify(updatedTeacher),
        );

        setEditOpen(false);

        toast.success("Profile Updated Successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Update Failed");
    }
  };

  const changePassword = async () => {
    try {
      if (passwordForm.new_password !== passwordForm.confirm_password) {
        toast.error("Passwords do not match");

        return;
      }

      const token = localStorage.getItem("teacher_token");

      const res = await fetch(
        "http://127.0.0.1:8000/teacher-profile/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: passwordForm.current_password,
            new_password: passwordForm.new_password,
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Password Updated");

        setPasswordOpen(false);

        setPasswordForm({
          current_password: "",

          new_password: "",

          confirm_password: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Update failed");
    }
  };

  return (
    <TeacherAuthGuard>
      <div
        className="
      w-full
      space-y-8
      "
      >
        {/* HEADER */}

        <div
          className="
        rounded-[36px]
        bg-white/75
        backdrop-blur-3xl
        border
        border-white/60
        shadow-lg
        p-8
        "
        >
          <h1
            className="
          text-4xl
          font-black
          text-slate-900
          "
          >
            Teacher Profile
          </h1>

          <p
            className="
          text-slate-500
          mt-2
          "
          >
            Manage faculty profile information
          </p>
        </div>

        {/* PROFILE */}

        <div
          className="
        rounded-[36px]
        bg-white/75
        backdrop-blur-3xl
        border
        border-white/60
        shadow-lg
        p-10
        "
        >
          <div
            className="
          flex
          flex-col
          lg:flex-row
          gap-10
          "
          >
            {/* AVATAR */}

            <div
              className="
            flex
            flex-col
            items-center
            "
            >
              <div
                className="
              w-36
              h-36
              rounded-[32px]
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-500
              text-white
              flex
              items-center
              justify-center
              text-5xl
              font-black
              shadow-xl
              "
              >
                {teacher?.name?.charAt(0)?.toUpperCase()}
              </div>

              <h2
                className="
              mt-5
              text-2xl
              font-black
              text-slate-900
              "
              >
                {teacher?.name}
              </h2>

              <p
                className="
              text-slate-500
              "
              >
                Faculty Member
              </p>
            </div>

            {/* INFO */}

            <div
              className="
            flex-1
            grid
            md:grid-cols-2
            gap-5
            "
            >
              <div
                className="
              rounded-3xl
              bg-violet-50
              p-5
              "
              >
                <User
                  className="
                text-violet-600
                mb-3
                "
                />

                <p
                  className="
                text-sm
                text-slate-500
                "
                >
                  Teacher ID
                </p>

                <h3
                  className="
                text-xl
                font-bold
                text-slate-900
                "
                >
                  {teacher?.teacher_id}
                </h3>
              </div>

              <div
                className="
              rounded-3xl
              bg-fuchsia-50
              p-5
              "
              >
                <Mail
                  className="
                text-fuchsia-600
                mb-3
                "
                />

                <p
                  className="
                text-sm
                text-slate-500
                "
                >
                  Email
                </p>

                <h3
                  className="
                text-lg
                font-bold
                break-all
                text-slate-900
                "
                >
                  {teacher?.email || "Not Available"}
                </h3>
              </div>
              <div
                className="
                rounded-3xl
                bg-amber-50
                p-5
                "
              >
                <p
                  className="
                  text-sm
                  text-slate-500
                  "
                >
                  Mobile No.
                </p>

                <h3
                  className="
                  text-xl
                  font-bold
                  text-slate-900
                  "
                >
                  {teacher?.mobile || "Not Set"}
                </h3>
              </div>

              <div
                className="
              rounded-3xl
              bg-blue-50
              p-5
              "
              >
                <BookOpen
                  className="
                text-blue-600
                mb-3
                "
                />

                <p
                  className="
                text-sm
                text-slate-500
                "
                >
                  Subjects
                </p>

                <h3
                  className="
                text-xl
                font-bold
                text-slate-900
                "
                >
                  {subjectCount}
                </h3>
              </div>
              <div
                className="
              rounded-3xl
              bg-orange-50
              p-5
              "
              >
                <p
                  className="
                text-sm
                text-slate-500
                "
                >
                  Department
                </p>

                <h3
                  className="
                text-xl
                font-bold
                text-slate-900
                "
                >
                  {teacher?.department || "Not Set"}
                </h3>
              </div>

              <div
                className="
              rounded-3xl
              bg-emerald-50
              p-5
              "
              >
                <Shield
                  className="
                text-emerald-600
                mb-3
                "
                />

                <p
                  className="
                text-sm
                text-slate-500
                "
                >
                  Role
                </p>

                <h3
                  className="
                text-xl
                font-bold
                text-slate-900
                "
                >
                  Teacher
                </h3>
              </div>
              <div
                className="
              rounded-3xl
              bg-cyan-50
              p-5
              "
              >
                <p
                  className="
                text-sm
                text-slate-500
                "
                >
                  Qualification
                </p>

                <h3
                  className="
                text-xl
                font-bold
                text-slate-900
                "
                >
                  {teacher?.qualification || "Not Set"}
                </h3>
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div
            className="
          mt-10
          flex
          flex-wrap
          gap-4
          "
          >
            <button
              onClick={() => setEditOpen(true)}
              className="
          h-12
          px-6
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-500
          text-white
          font-semibold
          flex
          items-center
          gap-2
          transition
            hover:from-violet-700
            hover:to-fuchsia-600
          "
            >
              <Edit3 size={18} />
              Edit Profile
            </button>

            <button
              onClick={() => setPasswordOpen(true)}
              className="
              px-8
              h-14
              rounded-2xl
              bg-slate-100
              flex
              items-center
              gap-2
              font-bold
              text-slate-900
              transition
              hover:bg-slate-300
              "
            >
              <Lock size={18} />
              Change Password
            </button>
          </div>
        </div>

        {/* EDIT PROFILE MODAL */}

        {editOpen && (
          <div
            className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-[9999]
      
      "
          >
            <div
              className="
        w-[700px]
        rounded-[36px]
        bg-white
        p-8
        shadow-2xl
        "
            >
              <div
                className="
          flex
          items-center
          justify-between
          mb-6
          "
              >
                <h2
                  className="
            text-3xl
            font-black
            text-slate-900
            "
                >
                  Edit Profile
                </h2>

                <button
                  onClick={() => setEditOpen(false)}
                  className="
            text-slate-500
            text-xl
            text-slate-900

            "
                >
                  ✕
                </button>
              </div>

              <div
                className="
          grid
          md:grid-cols-2
          gap-5
          text-slate-900

          "
              >
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Full Name"
                  className="
            h-12
            border
            rounded-2xl
            px-4
            text-slate-900
            "
                />

                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="Email"
                  className="
            h-12
            border
            rounded-2xl
            px-4
            "
                />

                <input
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mobile: e.target.value,
                    })
                  }
                  placeholder="Mobile"
                  className="
            h-12
            border
            rounded-2xl
            px-4
            "
                />

                <input
                  value={form.department}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      department: e.target.value,
                    })
                  }
                  placeholder="Department"
                  className="
            h-12
            border
            rounded-2xl
            px-4
            "
                />

                <input
                  value={form.qualification}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      qualification: e.target.value,
                    })
                  }
                  placeholder="Qualification"
                  className="
            h-12
            border
            rounded-2xl
            px-4
            md:col-span-2

            "
                />
              </div>

              <div
                className="
          flex
          justify-end
          gap-3
          mt-8
          text-slate-900

          "
              >
                <button
                  onClick={() => setEditOpen(false)}
                  className="
            px-6
            h-12
            rounded-2xl
            bg-slate-100
            transition
            hover:bg-slate-400
            "
                >
                  Cancel
                </button>

                <button
                  onClick={saveProfile}
                  className="
                px-6
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-500
                text-white
                "
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {passwordOpen && (
          <div
            className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-[9999]
      text-slate-900
      "
          >
            <div
              className="
        w-[500px]
        bg-white
        rounded-[36px]
        p-8
        shadow-2xl
        text-slate-900
        "
            >
              <h2
                className="
          text-3xl
          font-black
          mb-6
          text-slate-900
          "
              >
                Change Password
              </h2>

              <div
                className="
          space-y-4
          text-slate-900
          "
              >
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,

                      current_password: e.target.value,
                    })
                  }
                  className="
            w-full
            h-12
            border
            rounded-2xl
            px-4
            "
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,

                      new_password: e.target.value,
                    })
                  }
                  className="
            w-full
            h-12
            border
            rounded-2xl
            px-4
            "
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordForm.confirm_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,

                      confirm_password: e.target.value,
                    })
                  }
                  className="
            w-full
            h-12
            border
            rounded-2xl
            px-4
            "
                />
              </div>

              <div
                className="
          flex
          justify-end
          gap-3
          mt-6
          "
              >
                <button
                  onClick={() => setPasswordOpen(false)}
                  className="
            px-5
            h-11
            rounded-2xl
            bg-slate-100
            "
                >
                  Cancel
                </button>

                <button
                  onClick={changePassword}
                  className="
            px-5
            h-11
            rounded-2xl
            bg-violet-600
            text-white
            "
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherAuthGuard>
  );
}
