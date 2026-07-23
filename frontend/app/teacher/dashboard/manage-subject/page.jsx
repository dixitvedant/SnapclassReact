"use client";

import { useEffect, useState } from "react";

import { Plus, Share2, Users, Pencil, Trash2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import TeacherAuthGuard from "../components/TeacherAuthGuard";

export default function ManageSubjectPage() {
  const [subjects, setSubjects] = useState([]);

  const [name, setName] = useState("");

  const [code, setCode] = useState("");

  const [section, setSection] = useState("");

  const [loading, setLoading] = useState(false);

  const [studentModal, setStudentModal] = useState(false);

  const [studentList, setStudentList] = useState([]);

  const [editModal, setEditModal] = useState(false);

  const [editing, setEditing] = useState(null);

  const [editName, setEditName] = useState("");

  const [editCode, setEditCode] = useState("");

  const [editSection, setEditSection] = useState("");

  const [studentsModal, setStudentsModal] = useState(false);

  const [subjectStudents, setSubjectStudents] = useState([]);

  const [studentSearch, setStudentSearch] = useState("");

  const [selectedSubjectName, setSelectedSubjectName] = useState("");

  const [shareModal, setShareModal] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState(null);

  const [shareLink, setShareLink] = useState("");
  const [qrRef, setQrRef] = useState(null);

  // =====================================
  // LOAD SUBJECTS
  // =====================================

  const loadSubjects = async () => {
    try {
      const token = localStorage.getItem("teacher_token");

      const res = await fetch("http://127.0.0.1:8000/subject/teacher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setSubjects(data.subjects);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  //OPen students view
  const openStudents = async (subjectId, subjectName) => {
    try {
      const token = localStorage.getItem("teacher_token");
      const res = await fetch(
        `http://127.0.0.1:8000/subject/students/${subjectId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setSubjectStudents(data.students);

        setSelectedSubjectName(subjectName);

        setStudentsModal(true);
      }
    } catch (err) {
      console.log(err);

      toast.error("Failed loading students");
    }
  };

  // =====================================
  // CREATE
  // =====================================

  const createSubject = async () => {
    try {
      if (!name || !code || !section) {
        alert("Fill all fields");
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("teacher_token");

      const res = await fetch("http://127.0.0.1:8000/subject/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name,
          subject_code: code,
          section,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Subject Created");

        setName("");
        setCode("");
        setSection("");

        loadSubjects();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  // =====================================
  // DELETE
  // =====================================

  const deleteSubject = async (id) => {
    if (!confirm("Delete subject?")) return;

    const token = localStorage.getItem("teacher_token");

    const res = await fetch(
      `http://127.0.0.1:8000/subject/delete/${id}`,

      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (data.success) {
      toast.success("Subject Deleted");

      loadSubjects();
    } else {
      toast.error(data.message);
    }
  };

  const openEdit = (sub) => {
    setEditing(sub);

    setEditName(sub.name);

    setEditCode(sub.subject_code);

    setEditSection(sub.section);

    setEditModal(true);
  };

  //edit
  const saveEdit = async () => {
    const token = localStorage.getItem("teacher_token");
    const res = await fetch(
      `http://127.0.0.1:8000/subject/update/${editing.subject_id}`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,

          subject_code: editCode,

          section: editSection,
        }),
      },
    );

    const data = await res.json();

    if (data.success) {
      setEditModal(false);

      loadSubjects();
      toast.success("Subject Updated");
    }
  };

  ///Download QR
  const downloadQR = async () => {
    if (!qrRef) return;

    const dataUrl = await toPng(qrRef);

    const link = document.createElement("a");

    link.download = `${selectedSubject.subject_code}_QR.png`;

    link.href = dataUrl;

    link.click();

    toast.success("QR Downloaded");
  };
  // =====================================
  // SHARE
  // =====================================

  const shareCode = (subject) => {
    const teacher = JSON.parse(localStorage.getItem("teacher_data"));

    const link = `http://localhost:3000/student/enroll?code=${subject.subject_code}`;

    setSelectedSubject({
      ...subject,

      teacher_name: teacher?.name,
    });

    setShareLink(link);

    setShareModal(true);
  };

  return (
    <TeacherAuthGuard>
      <main
        className="
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
            Manage Subjects
          </h1>

          <p
            className="
          mt-2
          text-slate-500
          "
          >
            Create and manage classroom subjects
          </p>
        </div>

        {/* CREATE */}

        <div
          className="
        rounded-[36px]
        bg-white/75
        backdrop-blur-3xl
        border-2
        p-7
        space-y-4
        transition-all
        duration-300
        hover:bg-violet-50
        hover:border-violet-300
        hover:shadow-lg
        hover:-translate-y-1
        "
        >
          <h2
            className="
          text-2xl
          font-bold
          text-slate-900
          "
          >
            Create Subject
          </h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Subject Name"
            className="
            w-full
            h-14
            rounded-2xl
            border-2
            border-slate-300
            bg-white
            px-4
            text-slate-900
            placeholder:text-slate-400
            font-medium
            shadow-sm
            outline-none
            transition-all
            duration-200
            focus:border-violet-500
            focus:ring-4
            focus:ring-violet-200
            "
          />

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Subject Code"
            className="
            w-full
            h-14
            rounded-2xl
            border-2
            border-slate-300
            bg-white
            px-4
            text-slate-900
            placeholder:text-slate-400
            font-medium
            shadow-sm
            outline-none
            transition-all
            duration-200
            focus:border-violet-500
            focus:ring-4
            focus:ring-violet-200
            "
          />

          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Section"
            className="
            w-full
            h-14
            rounded-2xl
            border-2
            border-slate-300
            bg-white
            px-4
            text-slate-900
            placeholder:text-slate-400
            font-medium
            shadow-sm
            outline-none
            transition-all
            duration-200
            focus:border-violet-500
            focus:ring-4
            focus:ring-violet-200
            "
          />

          <button
            onClick={createSubject}
            className="
          w-full
          h-14
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-purple-500
          text-white
          font-semibold
          "
          >
            <Plus size={18} className="inline mr-2" />
            {loading ? "Creating..." : "Create Subject"}
          </button>
        </div>

        {/* SUBJECTS */}

        <div
          className="
        grid
        lg:grid-cols-2
        gap-6
        "
        >
          {subjects.map((sub) => (
            <div
              key={sub.subject_id}
              className="
              rounded-[36px]
              bg-white/75
              backdrop-blur-3xl
              border
              p-7
              shadow-lg
              transition-all
                duration-300
                hover:bg-violet-50
                hover:border-violet-300
                hover:shadow-lg
                hover:-translate-y-3
              "
            >
              <h3
                className="
                text-2xl
                font-bold
                text-slate-900
                "
              >
                {sub.name}
              </h3>

              <p
                className="
                text-slate-500
                mt-1
                "
              >
                {sub.subject_code}
                {" • "}
                {sub.section}
              </p>

              <div
                className="
                mt-6
                grid
                grid-cols-2
                gap-3
                "
              >
                <button
                  onClick={() => shareCode(sub)}
                  className="
                  h-12
                  rounded-2xl
                  bg-violet-100
                  text-violet-700
                  font-semibold
                  "
                >
                  <Share2 size={16} className="inline mr-2" />
                  Share
                </button>

                <button
                  onClick={() => openStudents(sub.subject_id, sub.name)}
                  className="
    h-12
    rounded-2xl
    bg-cyan-100
    text-cyan-700
    font-semibold
  "
                >
                  <Users
                    size={16}
                    className="
    inline
    mr-2
    "
                  />
                  Students
                </button>

                <button
                  onClick={() => openEdit(sub)}
                  className="
                h-12
                rounded-2xl
                bg-amber-100
                text-amber-700
                font-semibold
                "
                >
                  <Pencil size={16} className="inline mr-2" />
                  Edit
                </button>

                <button
                  onClick={() => deleteSubject(sub.subject_id)}
                  className="
                  h-12
                  rounded-2xl
                  bg-red-100
                  text-red-700
                  font-semibold
                  "
                >
                  <Trash2 size={16} className="inline mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {shareModal && selectedSubject && (
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
w-full
max-w-[720px]
rounded-[40px]
bg-white
border
border-violet-200
shadow-[0_25px_70px_rgba(124,58,237,0.18)]
p-7
"
            >
              {/* HEADER */}

              <div
                className="
flex
justify-between
items-start
mb-6
"
              >
                <div>
                  <h2
                    className="
text-4xl
font-black
text-slate-900
"
                  >
                    Share Subject
                  </h2>

                  <p
                    className="
text-slate-500
mt-1
"
                  >
                    Send QR or code to students
                  </p>
                </div>

                <button
                  onClick={() => setShareModal(false)}
                  className="
w-11
h-11
rounded-full
bg-gradient-to-r
from-violet-600
to-purple-500
text-white
font-bold
"
                >
                  ✕
                </button>
              </div>

              {/* BODY */}

              <div
                className="
grid
md:grid-cols-2
gap-7
items-center
"
              >
                {/* LEFT */}

                <div
                  className="
space-y-4
"
                >
                  <div>
                    <p
                      className="
text-slate-500
text-sm
"
                    >
                      Subject
                    </p>

                    <h3
                      className="
text-2xl
font-bold
text-slate-900
"
                    >
                      {selectedSubject.name}
                    </h3>
                  </div>

                  <div>
                    <p
                      className="
text-slate-500
text-sm
"
                    >
                      Subject Code
                    </p>

                    <h3
                      className="
text-xl
font-semibold
text-violet-700
"
                    >
                      {selectedSubject.subject_code}
                    </h3>
                  </div>

                  <div>
                    <p
                      className="
text-slate-500
text-sm
"
                    >
                      Teacher
                    </p>

                    <h3
                      className="
text-lg
font-medium
text-slate-800
"
                    >
                      {selectedSubject.teacher_name}
                    </h3>
                  </div>

                  <div>
                    <p
                      className="
text-slate-500
text-sm
mb-2
"
                    >
                      Enrollment Link
                    </p>

                    <div
                      className="
rounded-2xl
border
border-slate-200
bg-slate-50
p-3
text-sm
text-slate-700
break-all
"
                    >
                      {shareLink}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}

                <div
                  className="
flex
flex-col
items-center
space-y-4
"
                >
                  <div
                    ref={setQrRef}
                    className="
bg-white
p-4
rounded-3xl
shadow-md
border
border-violet-200
"
                  >
                    <QRCode value={shareLink} size={180} />
                  </div>

                  <div
                    className="
grid
grid-cols-3
gap-3
w-full
"
                  >
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedSubject.subject_code,
                        );

                        toast.success("Code Copied");
                      }}
                      className="
h-12
rounded-2xl
bg-violet-100
text-violet-700
font-semibold
"
                    >
                      Copy Code
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);

                        toast.success("Link Copied");
                      }}
                      className="
h-12
rounded-2xl
bg-cyan-100
text-cyan-700
font-semibold
"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={downloadQR}
                      className="
h-12
rounded-2xl
bg-amber-100
text-amber-700
font-semibold
"
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {studentsModal && (
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
w-full
max-w-[760px]
rounded-[40px]
bg-white
border
border-violet-200
shadow-[0_25px_70px_rgba(124,58,237,0.18)]
p-7
max-h-[85vh]
flex
flex-col
overflow-hidden
"
            >
              {/* HEADER */}

              <div
                className="
flex
justify-between
items-start
mb-6
"
              >
                <div>
                  <h2
                    className="
text-4xl
font-black
text-slate-900
leading-none
"
                  >
                    Enrolled Students
                  </h2>

                  <p
                    className="
text-slate-500
mt-2
text-lg
"
                  >
                    {selectedSubjectName}
                  </p>
                </div>

                <button
                  onClick={() => setStudentsModal(false)}
                  className="
w-12
h-12
rounded-full
bg-gradient-to-r
from-violet-600
to-purple-500
text-white
font-bold
text-xl
hover:scale-105
transition
shadow-lg
"
                >
                  ✕
                </button>
              </div>

              {/* SEARCH */}

              <label
                className="
block
mb-3
text-slate-700
font-semibold
text-lg
"
              >
                Search Student
              </label>

              <input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search student..."
                className="
w-full
h-14
rounded-2xl
bg-white
border-2
border-slate-200
px-5
text-slate-900
placeholder:text-slate-400
outline-none
mb-7
transition
focus:border-violet-500
focus:ring-4
focus:ring-violet-200
"
              />

              {/* TOTAL */}

              <div className="mb-5">
                <p
                  className="
text-slate-500
font-medium
"
                >
                  Total Students
                </p>

                <h3
                  className="
text-5xl
font-black
text-violet-700
leading-none
mt-1
"
                >
                  {
                    subjectStudents.filter((s) =>
                      (s.students?.name || "")
                        .toLowerCase()
                        .includes(studentSearch.toLowerCase()),
                    ).length
                  }
                </h3>
              </div>

              {/* TABLE */}

              <div
                className="
rounded-3xl
overflow-hidden
border
border-violet-200
bg-white
flex
flex-col
flex-1
min-h-0
shadow-sm
"
              >
                {/* HEADER */}

                <table
                  className="
w-full
table-fixed
"
                >
                  <thead
                    className="
bg-violet-50
text-slate-800
"
                  >
                    <tr>
                      <th
                        className="
py-4
font-bold
w-1/3
text-center
"
                      >
                        Student ID
                      </th>

                      <th
                        className="
py-4
font-bold
text-center
"
                      >
                        Student Name
                      </th>
                    </tr>
                  </thead>
                </table>

                {/* BODY */}

                <div
                  className="
overflow-y-auto
max-h-[320px]
"
                >
                  <table
                    className="
w-full
table-fixed
"
                  >
                    <tbody>
                      {subjectStudents
                        .filter((s) =>
                          (s.students?.name || "")
                            .toLowerCase()
                            .includes(studentSearch.toLowerCase()),
                        )
                        .map((student) => (
                          <tr
                            key={student.student_id}
                            className="
border-t
border-slate-100
hover:bg-violet-50
transition
"
                          >
                            <td
                              className="
w-1/3
py-4
px-5
text-violet-600
font-semibold
text-center
"
                            >
                              {student.student_id}
                            </td>

                            <td
                              className="
py-4
px-5
text-slate-800
font-medium
text-center
"
                            >
                              {student.students?.name}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {editModal && (
          <div
            className="
    fixed
    inset-0
    z-50
    bg-black/40
    flex
    items-center
    justify-center
    p-4
    "
          >
            <div
              className="
      w-full
      max-w-lg
      rounded-[36px]
      bg-white
      p-7
      shadow-2xl
      space-y-4
      "
            >
              <h2
                className="
                text-3xl
                font-black
                text-slate-900
                "
              >
                Edit Subject
              </h2>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="
                    w-full
                    h-18
                    rounded-3xl
                    border-2
                    border-slate-300
                    bg-white
                    px-6
                    text-xl
                    text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    focus:border-purple-500
                "
                placeholder="Subject Name"
              />

              <input
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                className="
                    w-full
                    h-18
                    rounded-3xl
                    border-2
                    border-slate-300
                    bg-white
                    px-6
                    text-xl
                    text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    focus:border-purple-500
                "
                placeholder="Subject Code"
              />

              <input
                value={editSection}
                onChange={(e) => setEditSection(e.target.value)}
                className="
                    w-full
                    h-18
                    rounded-3xl
                    border-2
                    border-slate-300
                    bg-white
                    px-6
                    text-xl
                    text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    focus:border-purple-500
                "
                placeholder="Section"
              />

              <div
                className="
        grid
        grid-cols-2
        gap-3
        "
              >
                <button
                  onClick={() => setEditModal(false)}
                  className="
                h-12
                rounded-2xl
                bg-slate-900
                "
                >
                  Cancel
                </button>

                <button
                  onClick={saveEdit}
                  className="
          h-12
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-purple-500
          text-white
          font-semibold
          "
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </TeacherAuthGuard>
  );
}
