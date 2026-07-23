"use client";

import { useMemo, useState, useEffect } from "react";

import { Megaphone, Search, Plus, Paperclip, Mail } from "lucide-react";

import toast from "react-hot-toast";

import TeacherAuthGuard from "../components/TeacherAuthGuard";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("All");

  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [type, setType] = useState("Announcement");

  const [file, setFile] = useState(null);

  const [sending, setSending] = useState(false);

  const [subjects, setSubjects] = useState([]);

  const [subjectId, setSubjectId] = useState("");

  // =====================================
  // LOAD ANNOUNCEMENTS
  // =====================================
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("teacher_token");

      if (!token) return;

      const res = await fetch("http://127.0.0.1:8000/announcement/teacher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("Announcements:", data);

      if (data.success) {
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed loading announcements");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // EFFECT
  // =====================================

  useEffect(() => {
    fetchAnnouncements();
    loadSubjects();
  }, []);
  // =====================================
  // FILTER
  // =====================================
  // =====================================
  // SEND ANNOUNCEMENT
  // =====================================

  const handleSendAnnouncement = async () => {
    try {
      if (!title || !message || !subjectId) {
        toast.error("Fill required fields");
        return;
      }

      setSending(true);

      const formData = new FormData();

      formData.append("subject_id", subjectId);

      formData.append("title", title);

      formData.append("message", message);

      formData.append("announcement_type", type);

      if (file) {
        formData.append("file", file);
      }

      const token = localStorage.getItem("teacher_token");

      const res = await fetch("http://127.0.0.1:8000/announcement/create", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        toast.success(`Announcement sent to ${data.students} students`);

        // RESET

        setTitle("");

        setMessage("");

        setType("Announcement");

        setFile(null);

        setSubjectId("");

        setOpenModal(false);

        // REFRESH TABLE

        fetchAnnouncements();
      } else {
        toast.error(data.message || "Send failed");
      }
    } catch (err) {
      console.log(err);

      toast.error("Send failed");
    } finally {
      setSending(false);
    }
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const searchMatch = a.title?.toLowerCase().includes(search.toLowerCase());

      const typeMatch =
        typeFilter === "All" || a.announcement_type === typeFilter;
      return searchMatch && typeMatch;
    });
  }, [announcements, search, typeFilter]);

  async function loadSubjects() {
    try {
      const token = localStorage.getItem("teacher_token");

      if (!token) return;

      const res = await fetch("http://127.0.0.1:8000/subject/teacher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("Subjects API:", data);

      if (data.success) {
        setSubjects(data.subjects);
      }
    } catch (err) {
      console.log(err);
    }
  }

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
        Loading Announcements...
      </div>
    );
  }

  return (
    <TeacherAuthGuard>
      <main
        className="
      min-h-screen
      bg-gradient-to-br
      from-violet-50
      via-fuchsia-50
      to-white
      p-8
      space-y-8
      "
      >
        {/* HEADER */}

        <div
          className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        "
        >
          <div>
            <h1
              className="
            text-5xl
            font-black
            text-slate-900
            "
            >
              Announcements
            </h1>

            <p
              className="
            mt-2
            text-lg
            text-slate-500
            "
            >
              Send notices, holidays and lecture updates
            </p>
          </div>

          {/* CREATE BUTTON */}

          <button
            onClick={() => setOpenModal(true)}
            className="
          h-14
          px-6
          rounded-3xl
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-500
          text-white
          font-bold
          flex
          items-center
          gap-2
          shadow-lg
          hover:scale-105
          transition
          "
          >
            <Plus size={20} />
            Create Announcement
          </button>
        </div>

        {/* FILTERS */}

        <div
          className="
        rounded-[35px]
        bg-white
        border
        border-violet-100
        shadow-xl
        p-6
        grid
        md:grid-cols-3
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
              placeholder="Search Topic..."
              className="
            w-full
            h-12
            rounded-2xl
            border-2
            border-violet-200
            pl-11
            pr-4
            text-slate-900
            outline-none
            "
            />
          </div>

          {/* TYPE FILTER */}

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
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
            <option>Holiday</option>
            <option>Cancelled</option>
            <option>Announcement</option>
            <option>Exam</option>
            <option>Notes</option>
          </select>

          {/* COUNT */}

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
            Total:
            {filteredAnnouncements.length}
          </div>
        </div>

        {/* TABLE */}

        <div
          className="
        bg-white
        rounded-[35px]
        shadow-xl
        border
        border-violet-100
        p-6
        "
        >
          <div
            className="
          flex
          items-center
          gap-3
          mb-5
          "
          >
            <div
              className="
            w-12
            h-12
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-fuchsia-500
            text-white
            flex
            items-center
            justify-center
            "
            >
              <Megaphone />
            </div>

            <h2
              className="
            text-3xl
            font-black
            text-slate-900
            "
            >
              Announcement History
            </h2>
          </div>

          <div
            className="
          overflow-auto
          rounded-3xl
          border
          border-violet-100
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
              "
              >
                <tr>
                  <th className="px-6 py-4 text-left text-slate-900">
                    Date Time
                  </th>

                  <th className="px-6 py-4 text-left text-slate-900">Topic</th>

                  <th className="px-6 py-4 text-left text-slate-900">Status</th>

                  <th className="px-6 py-4 text-left text-slate-900">
                    Attachment
                  </th>

                  <th className="px-6 py-4 text-left text-slate-900">Mail</th>
                </tr>
              </thead>

              <tbody>
                {filteredAnnouncements.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="
                    px-6
                    py-12
                    text-center
                    text-slate-500
                    "
                    >
                      No announcements yet
                    </td>
                  </tr>
                ) : (
                  filteredAnnouncements.map((a) => (
                    <tr
                      key={a.notification_id}
                      className="
                      border-t
                      hover:bg-violet-50
                      "
                    >
                      <td className="px-6 py-4 text-slate-700">
                        {(() => {
                          const d = new Date(a.created_at);

                          return d.toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });
                        })()}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {a.title}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`
                                px-3
                                py-2
                                rounded-xl
                                font-semibold

                                ${
                                  a.announcement_type === "Holiday"
                                    ? "bg-green-100 text-green-700"
                                    : a.announcement_type === "Cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : a.announcement_type === "Exam"
                                        ? "bg-violet-100 text-violet-700"
                                        : a.announcement_type === "Notes"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-orange-100 text-orange-700"
                                }
                            `}
                        >
                          {a.announcement_type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {a.file_url ? (
                          <div
                            className="
                            flex
                            items-center
                            gap-2
                            text-violet-700
                            font-medium
                            "
                          >
                            <Paperclip size={16} />

                            {a.file_url}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className="
                          px-3
                          py-2
                          rounded-xl
                          bg-emerald-100
                          text-emerald-700
                          font-semibold
                          "
                        >
                          Sent
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* CREATE ANNOUNCEMENT MODAL */}

        {openModal && (
          <div
            className="
            fixed
            inset-0
            z-50
            bg-black/40
            backdrop-blur-sm
            overflow-y-auto
            flex
            items-start
            justify-center
            p-6
            "
          >
            <div
              className="
            w-full
            max-w-[780px]
            max-h-[90vh]
            overflow-y-auto
            mt-8
            mb-8
            rounded-[40px]
            bg-white
            border
            border-violet-200
            shadow-2xl
            p-7
            relative
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
                    Create Announcement
                  </h2>

                  <p
                    className="
                  mt-2
                  text-slate-500
                  "
                  >
                    Send updates to students
                  </p>
                </div>

                <button
                  onClick={() => setOpenModal(false)}
                  className="
                w-11
                h-11
                rounded-full
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-500
                text-white
                font-bold
                "
                >
                  ✕
                </button>
              </div>
              <div className="mb-5">
                <label
                  className="
    block
    mb-2
    text-slate-700
    font-semibold
  "
                >
                  Select Subject
                </label>

                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="
    w-full
    h-12
    rounded-2xl
    border-2
    border-violet-200
    px-4
    text-slate-800
  "
                >
                  <option value="">Select Subject</option>

                  {subjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* TITLE */}

              <div className="mb-5">
                <label
                  className="
                block
                mb-2
                text-slate-700
                font-semibold
                "
                >
                  Announcement Title
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Lecture Cancelled / Holiday Notice"
                  className="
                w-full
                h-12
                rounded-2xl
                border-2
                border-violet-200
                px-4
                text-slate-900
                outline-none
                "
                />
              </div>

              {/* MESSAGE */}

              <div className="mb-5">
                <label
                  className="
                block
                mb-2
                text-slate-700
                font-semibold
                "
                >
                  Reason / Details
                </label>

                <textarea
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write announcement details..."
                  className="
                w-full
                rounded-3xl
                border-2
                border-violet-200
                px-4
                py-3
                text-slate-900
                outline-none
                resize-none
                "
                />
              </div>

              {/* TYPE */}

              <div className="mb-5">
                <label
                  className="
                block
                mb-2
                text-slate-700
                font-semibold
                "
                >
                  Status / Type
                </label>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="
                w-full
                h-12
                rounded-2xl
                border-2
                border-violet-200
                px-4
                text-slate-800
                "
                >
                  <option>Announcement</option>
                  <option>Holiday</option>
                  <option>Cancelled</option>
                  <option>Exam</option>
                  <option>Notes</option>
                </select>
              </div>

              {/* FILE */}

              <div className="mb-6">
                <label
                  className="
                block
                mb-2
                text-slate-700
                font-semibold
                "
                >
                  Attach File
                </label>

                <label
                  className="
                h-14
                rounded-3xl
                border-2
                border-dashed
                border-violet-300
                flex
                items-center
                justify-center
                gap-2
                cursor-pointer
                text-violet-700
                font-semibold
                hover:bg-violet-50
                transition
                "
                >
                  <Paperclip size={18} />

                  {file ? file.name : "Upload PDF / Notes / Timetable"}

                  <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              </div>

              {/* ACTIONS */}

              <div
                className="
              grid
              grid-cols-2
              gap-3
              "
              >
                <button
                  onClick={() => setOpenModal(false)}
                  className="
                h-12
                rounded-2xl
                bg-slate-900
                text-white
                font-semibold
                "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendAnnouncement}
                  className="
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-500
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                "
                >
                  <Mail size={18} />

                  {sending ? "Sending..." : "Send Announcement"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </TeacherAuthGuard>
  );
}
