"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Search,
  BookOpen,
  CalendarDays,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";
import TeacherAuthGuard from "../components/TeacherAuthGuard";

export default function LectureManagementPage() {
  const [lectures, setLectures] = useState([]);

  const [loading, setLoading] = useState(true);

  const [limit, setLimit] = useState(5);

  const [dateFilter, setDateFilter] = useState("All");

  const [search, setSearch] = useState("");

  const [subjectFilter, setSubjectFilter] = useState("All");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [viewModal, setViewModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedLecture, setSelectedLecture] = useState(null);

  const [viewData, setViewData] = useState(null);

  const [editLogs, setEditLogs] = useState([]);

  // =====================================
  // LOAD LECTURES
  // =====================================

  const loadLectures = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("teacher_token");

      if (!token) return;

      const res = await fetch(
        `http://127.0.0.1:8000/lecture-management/teacher?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      console.log("Lectures:", data);

      if (data.success) {
        setLectures(data.sessions || []);
      }
    } catch (err) {
      console.log(err);

      toast.error("Failed loading lectures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, [limit]);

  // =====================================
  // SUBJECT FILTER OPTIONS
  // =====================================

  const subjects = useMemo(() => {
    return [...new Set(lectures.map((l) => l.subject?.name).filter(Boolean))];
  }, [lectures]);

  // =====================================
  // FILTERED LECTURES
  // =====================================
  const filteredLectures = lectures.filter((lecture) => {
    const subject = lecture.subject?.name?.toLowerCase() || "";

    const code = lecture.subject?.subject_code?.toLowerCase() || "";

    const searchMatch =
      subject.includes(search.toLowerCase()) ||
      code.includes(search.toLowerCase());

    const subjectMatch =
      subjectFilter === "All" || lecture.subject?.name === subjectFilter;

    const d = new Date(lecture.lecture_time);

    const now = new Date();

    let dateMatch = true;

    // QUICK FILTER

    if (dateFilter === "Today") {
      dateMatch = d.toDateString() === now.toDateString();
    } else if (dateFilter === "Week") {
      const diff = (now - d) / (1000 * 60 * 60 * 24);

      dateMatch = diff <= 7;
    } else if (dateFilter === "Month") {
      dateMatch =
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
    }

    // DATE RANGE

    if (fromDate && dateMatch) {
      dateMatch = d >= new Date(fromDate);
    }

    if (toDate && dateMatch) {
      const end = new Date(toDate);

      end.setHours(23, 59, 59);

      dateMatch = d <= end;
    }

    return searchMatch && subjectMatch && dateMatch;
  });
  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-3xl
        font-black
        text-violet-700
        "
      >
        Loading Lectures...
      </div>
    );
  }
  // =====================================
  // VIEW LECTURE
  // =====================================

  const openView = async (lecture) => {
    try {
      const token = localStorage.getItem("teacher_token");

      const res = await fetch(
        `http://127.0.0.1:8000/lecture-management/view/${lecture.session_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setViewData(data);
        setViewModal(true);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed loading lecture");
    }
  };
  // =====================================
  // EDIT OPEN
  // =====================================

  const openEdit = async (lecture) => {
    try {
      const token = localStorage.getItem("teacher_token");

      const res = await fetch(
        `http://127.0.0.1:8000/lecture-management/view/${lecture.session_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setSelectedLecture(lecture);
        setEditLogs(data.logs);
        setEditModal(true);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed loading lecture");
    }
  };
  // =====================================
  // DELETE OPEN
  // =====================================

  const openDelete = (lecture) => {
    setSelectedLecture(lecture);

    setDeleteModal(true);
  };

  // =====================================
  // DELETE LECTURE
  // =====================================

  const deleteLecture = async () => {
    try {
      const token = localStorage.getItem("teacher_token");

      const res = await fetch(
        `http://127.0.0.1:8000/lecture-management/delete/${selectedLecture.session_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Lecture Deleted");

        setDeleteModal(false);

        loadLectures();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };
  // =====================================
  // TOGGLE STATUS
  // =====================================

  const toggleStatus = (id) => {
    setEditLogs(
      editLogs.map((row) =>
        row.id === id
          ? {
              ...row,
              is_present: !row.is_present,
            }
          : row,
      ),
    );
  };

  // =====================================
  // SAVE EDIT
  // =====================================

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("teacher_token");

      const res = await fetch(
        `http://127.0.0.1:8000/lecture-management/edit/${selectedLecture.session_id}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            logs: editLogs.map((l) => ({
              id: l.id,
              is_present: l.is_present,
            })),
          }),
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success("Lecture Updated");

        setEditModal(false);

        // ERP SYNC REFRESH

        loadLectures();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.log(err);

      toast.error("Update failed");
    }
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
          text-5xl
          font-black
          text-slate-900
          "
          >
            Lecture Management
          </h1>

          <p
            className="
          mt-2
          text-slate-500
          text-lg
          "
          >
            Manage and correct attendance lectures
          </p>
        </div>

        {/* FILTERS */}

        <div
          className="
        rounded-[36px]
        bg-white/75
        backdrop-blur-3xl
        border
        border-white/60
        shadow-lg
        p-6
        grid
        md:grid-cols-5
        gap-4
        "
        >
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="
            absolute
            left-4
            top-4
            text-slate-400
            "
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lecture..."
              className="
            w-full
            h-12
            rounded-2xl
            border-2
            border-violet-200
            pl-11
            pr-4
            outline-none
            text-slate-800
            "
            />
          </div>

          {/* SUBJECT FILTER */}

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="
          h-12
          rounded-2xl
          border-2
          border-violet-200
          px-4
          text-slate-800
          "
          >
            <option>All</option>

            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="
            h-12
            rounded-2xl
            border-2
            border-violet-200
            px-4
            text-slate-800
            "
          >
            <option>All</option>
            <option>Today</option>
            <option>Week</option>
            <option>Month</option>
          </select>
          {/* FROM DATE */}

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="
          h-12
          rounded-2xl
          border-2
          border-violet-200
          px-4
          text-slate-800
          "
          />

          {/* TO DATE */}

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="
          h-12
          rounded-2xl
          border-2
          border-violet-200
          px-4
          text-slate-800
          "
          />
          {/* RECORD COUNT */}

          <div
            className="
          h-12
          rounded-2xl
          bg-violet-100
          text-violet-700
          font-bold
          flex
          items-center
          justify-center
          "
          >
            Lectures: {filteredLectures.length}
          </div>
        </div>

        {/* LECTURE CARDS */}

        <div
          className="
        grid
        lg:grid-cols-2
        gap-6
        "
        >
          {filteredLectures.map((lecture) => (
            <div
              key={lecture.session_id}
              className="
            rounded-[36px]
            bg-white/75
            backdrop-blur-3xl
            border
            border-white/60
            shadow-lg
            p-7
            transition-all
            duration-300
            hover:bg-violet-50
            hover:border-violet-300
            hover:shadow-lg
            hover:-translate-y-2
            "
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className="
                  text-2xl
                  font-black
                  text-slate-900
                  "
                  >
                    {lecture.subject?.name}
                  </h3>

                  <p
                    className="
                  text-violet-700
                  font-semibold
                  mt-1
                  "
                  >
                    {lecture.subject?.subject_code}
                  </p>
                </div>

                <div
                  className="
                w-14
                h-14
                rounded-2xl
                bg-violet-100
                text-violet-700
                flex
                items-center
                justify-center
                "
                >
                  <BookOpen />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div
                  className="
                flex
                items-center
                gap-2
                text-slate-600
                "
                >
                  <CalendarDays size={18} />

                  {(() => {
                    const d = new Date(lecture.lecture_time);

                    d.setMinutes(d.getMinutes() + 330);

                    return d.toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  })()}
                </div>
              </div>

              <div
                className="
              mt-6
              grid
              grid-cols-3
              gap-3
              "
              >
                <button
                  onClick={() => openView(lecture)}
                  className="
                h-12
                rounded-2xl
                bg-cyan-100
                text-cyan-700
                font-semibold
                "
                >
                  <Eye size={16} className="inline mr-2" />
                  View
                </button>

                <button
                  onClick={() => openEdit(lecture)}
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
                  onClick={() => openDelete(lecture)}
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
        {/* LOAD MORE */}

        <div
          className="
          flex
          justify-center
          mt-8
  "
        >
          <button
            onClick={() => setLimit(limit + 5)}
            className="
          h-12
          px-6
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-500
          text-white
          font-semibold
          shadow-lg
          hover:scale-[1.03]
          transition
          "
          >
            Load More
          </button>
        </div>
        {/* VIEW MODAL */}

        {viewModal && viewData && (
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
          p-4
          "
          >
            <div
              className="
            w-full
            max-w-[850px]
            rounded-[40px]
            bg-white
            border
            border-violet-200
            shadow-2xl
            p-7
            max-h-[85vh]
            overflow-auto
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
                    Lecture Details
                  </h2>

                  <p className="text-slate-500 mt-2">Attendance Summary</p>
                </div>

                <button
                  onClick={() => setViewModal(false)}
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

              {/* SUMMARY */}

              <div
                className="
              grid
              md:grid-cols-3
              gap-4
              mb-6
              "
              >
                <div
                  className="
                rounded-3xl
                bg-violet-100
                p-5
                "
                >
                  <p className="text-slate-500">Students</p>

                  <h3
                    className="
                  text-4xl
                  font-black
                  text-violet-700
                  "
                  >
                    {viewData.summary?.students}
                  </h3>
                </div>

                <div
                  className="
                rounded-3xl
                bg-emerald-100
                p-5
                "
                >
                  <p className="text-slate-500">Present</p>

                  <h3
                    className="
                  text-4xl
                  font-black
                  text-emerald-700
                  "
                  >
                    {viewData.summary?.present}
                  </h3>
                </div>

                <div
                  className="
                rounded-3xl
                bg-rose-100
                p-5
                "
                >
                  <p className="text-slate-500">Absent</p>

                  <h3
                    className="
                  text-4xl
                  font-black
                  text-rose-700
                  "
                  >
                    {viewData.summary?.absent}
                  </h3>
                </div>
              </div>

              {/* TABLE */}

              <div
                className="
              rounded-3xl
              border
              overflow-hidden
              "
              >
                <table
                  className="
                w-full
                "
                >
                  <thead
                    className="
                        bg-violet-100
                        text-slate-800
                        "
                  >
                    <tr>
                      <th
                        className="
                        p-4
                        text-left
                        text-slate-900
                        font-bold
                        "
                      >
                        Student ID
                      </th>

                      <th
                        className="
                        p-4
                        text-left
                        text-slate-900
                        font-bold
                        "
                      >
                        Name
                      </th>

                      <th
                        className="
                        p-4
                        text-left
                        text-slate-900
                        font-bold
                        "
                      >
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {viewData.logs.map((row) => (
                      <tr
                        key={row.id}
                        className="
                        border-t
                        hover:bg-violet-50
                        "
                      >
                        <td
                          className="
                            p-4
                            text-slate-800
                            font-medium
                            "
                        >
                          {row.students?.student_id}
                        </td>
                        <td
                          className="
                            p-4
                            text-slate-800
                            font-medium
                            "
                        >
                          {row.students?.name}
                        </td>

                        <td
                          className="
                            p-4
                            text-slate-800
                            font-medium
                            "
                        >
                          {row.is_present ? (
                            <span
                              className="
                              text-green-600
                              font-bold
                              "
                            >
                              ✅ Present
                            </span>
                          ) : (
                            <span
                              className="
                              text-red-600
                              font-bold
                              "
                            >
                              ❌ Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}

        {deleteModal && (
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
            max-w-md
            rounded-[36px]
            bg-white
            p-7
            shadow-2xl
            "
            >
              <h2
                className="
              text-3xl
              font-black
              text-slate-900
              "
              >
                Delete Lecture?
              </h2>

              <p
                className="
              mt-3
              text-slate-500
              "
              >
                This removes session and attendance logs permanently.
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
                  onClick={() => setDeleteModal(false)}
                  className="
                h-12
                rounded-2xl
                bg-slate-900
                text-white
                "
                >
                  Cancel
                </button>

                <button
                  onClick={deleteLecture}
                  className="
                h-12
                rounded-2xl
                bg-red-500
                text-white
                font-semibold
                "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* EDIT MODAL */}

        {editModal && (
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
          p-4
          "
          >
            <div
              className="
            w-full
            max-w-[900px]
            rounded-[40px]
            bg-white
            border
            border-violet-200
            shadow-2xl
            p-7
            max-h-[85vh]
            overflow-auto
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
                    Edit Lecture
                  </h2>

                  <p
                    className="
                  text-slate-500
                  mt-2
                  "
                  >
                    Correct AI attendance
                  </p>
                </div>

                <button
                  onClick={() => setEditModal(false)}
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

              {/* TABLE */}

              <div
                className="
              rounded-3xl
              border
              overflow-hidden
              "
              >
                <table
                  className="
                w-full
                "
                >
                  <thead
                    className="
                  bg-violet-100
                  text-slate-900
                  "
                  >
                    <tr>
                      <th className=" p-4 text-left text-slate-900 font-bold">
                        Student ID
                      </th>

                      <th className="p-4 text-left text-slate-900 font-bold">
                        Name
                      </th>

                      <th className="p-4 text-left text-slate-900 font-bold   ">
                        Status
                      </th>

                      <th className="p-4 text-left text-slate-900 font-bold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {editLogs.map((row) => (
                      <tr
                        key={row.id}
                        className="
                        border-t
                        hover:bg-violet-50
                        "
                      >
                        <td className="p-4 text-slate-800 font-medium">
                          {row.students?.student_id}
                        </td>

                        <td className="p-4 text-slate-800 font-medium">
                          {row.students?.name}
                        </td>

                        <td className="p-4 text-slate-800 font-medium">
                          {row.is_present ? (
                            <span
                              className="
                              text-green-600
                              font-bold
                              "
                            >
                              ✅ Present
                            </span>
                          ) : (
                            <span
                              className="
                              text-red-600
                              font-bold
                              "
                            >
                              ❌ Absent
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => toggleStatus(row.id)}
                            className="
                            h-10
                            px-4
                            rounded-2xl
                            bg-amber-100
                            text-amber-700
                            font-semibold
                            "
                          >
                            Toggle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ACTIONS */}

              <div
                className="
              mt-6
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
                text-white
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
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </TeacherAuthGuard>
  );
}
