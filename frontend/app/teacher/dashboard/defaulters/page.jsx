"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Download, AlertTriangle, Users, Mail } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import TeacherAuthGuard from "../components/TeacherAuthGuard";

export default function DefaultersPage() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("75");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const token = localStorage.getItem("teacher_token");

    if (!token) return;

    const res = await fetch("http://127.0.0.1:8000/defaulters/teacher", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log(data);

    if (data.success) {
      setStudents(data.students || []);
    }
  }

  async function sendWarning(studentId) {
    try {
      const token = localStorage.getItem("teacher_token");

      const res = await fetch(
        `http://127.0.0.1:8000/defaulter-actions/warn-student/${studentId}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send warning");
    }
  }

  async function notifyParent(studentId) {
    try {
      const token = localStorage.getItem("teacher_token");

      const res = await fetch(
        `http://127.0.0.1:8000/defaulter-actions/notify-parent/${studentId}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to notify parent");
    }
  }

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const searchMatch = s.student_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const attendance = Number(s.attendance);

      let filterMatch = true;

      if (filter === "75") {
        filterMatch = attendance < 75;
      }

      if (filter === "65") {
        filterMatch = attendance < 65;
      }

      if (filter === "50") {
        filterMatch = attendance < 50;
      }

      return searchMatch && filterMatch;
    });
  }, [students, search, filter]);

  // ======================
  // EXPORT CSV
  // ======================

  function exportCSV() {
    const ws = XLSX.utils.json_to_sheet(filtered);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,

      ws,

      "Defaulters",
    );

    XLSX.writeFile(
      wb,

      "defaulters.csv",
    );
  }

  // ======================
  // EXPORT EXCEL
  // ======================

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(filtered);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,

      ws,

      "Defaulters",
    );

    XLSX.writeFile(
      wb,

      "defaulters.xlsx",
    );
  }

  // ======================
  // EXPORT PDF
  // ======================

  function exportPDF() {
    const doc = new jsPDF();

    doc.text("Defaulters Report", 14, 15);

    autoTable(doc, {
      startY: 25,

      head: [["ID", "Name", "Present", "Absent", "%"]],

      body: filtered.map((s) => [
        s.student_id,

        s.student_name,

        s.present,

        s.absent,

        s.attendance,
      ]),
    });

    doc.save("defaulters.pdf");
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
      "
      >
        <h1
          className="
        text-5xl
        font-black
        text-slate-900
        "
        >
          Defaulters
        </h1>

        <p
          className="
        text-slate-500
        mt-2
        "
        >
          Students Below Attendance Requirement
        </p>

        {/* TOP */}

        <div
          className="
        flex
        flex-wrap
        gap-3
        mt-8
        mb-8
        text-slate-900
        "
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Student"
            className="
          h-12
          px-4
          rounded-2xl
          border
          "
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="
          h-12
          px-4
          rounded-2xl
          border
          "
          >
            <option value="75">Below 75%</option>

            <option value="65">Below 65%</option>

            <option value="50">Below 50%</option>
          </select>

          <button
            onClick={exportCSV}
            className="
          h-12
          px-5
          rounded-2xl
          bg-violet-100
          transition
          hover:bg-violet-200
          "
          >
            CSV
          </button>

          <button
            onClick={exportExcel}
            className="
          h-12
          px-5
          rounded-2xl
          bg-fuchsia-100
            transition
            hover:bg-fuchsia-200
          "
          >
            Excel
          </button>

          <button
            onClick={exportPDF}
            className="
          h-12
          px-5
          rounded-2xl
          bg-rose-100
            transition
            hover:bg-rose-200
          "
          >
            PDF
          </button>
        </div>

        {/* TABLE */}

        <div
          className="
        bg-white
        rounded-[35px]
        shadow-xl
        overflow-auto
        "
        >
          <table
            className="
          w-full
          text-slate-900
          "
          >
            <thead
              className="
            bg-violet-100
            text-slate-900
            "
            >
              <tr>
                <th className="p-4">ID</th>

                <th className="p-4">Student</th>

                <th className="p-4">Present</th>

                <th className="p-4">Absent</th>

                <th className="p-4">Attendance</th>

                <th className="p-4">Status</th>

                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.student_id}
                  className="
                    border-t
                    text-slate-700
                    hover:bg-violet-50
                    "
                >
                  <td className="p-4">{s.student_id}</td>

                  <td className="p-4">{s.student_name}</td>

                  <td className="p-4">{s.present}</td>

                  <td className="p-4">{s.absent}</td>

                  <td className="p-4">{s.attendance}%</td>

                  <td className="p-4">
                    {s.attendance < 50 ? (
                      <span
                        className="
                            px-3
                            py-2
                            rounded-xl
                            bg-red-100
                            text-red-700
                            "
                      >
                        Critical
                      </span>
                    ) : (
                      <span
                        className="
                            px-3
                            py-2
                            rounded-xl
                            bg-orange-100
                            text-orange-700
                            "
                      >
                        Warning
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div
                      className="
                    flex
                    gap-2
                    "
                    >
                      <button
                        onClick={() => sendWarning(s.student_id)}
                        className="
                      px-3
                      py-2
                      rounded-xl
                      bg-orange-500
                      text-white
                      text-sm
                      hover:bg-orange-600
                      "
                      >
                        Warn
                      </button>

                      <button
                        onClick={() => notifyParent(s.student_id)}
                        className="
                        px-3
                        py-2
                        rounded-xl
                        bg-violet-600
                        text-white
                        text-sm
                        hover:bg-violet-700
                        "
                      >
                        Parent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </TeacherAuthGuard>
  );
}
