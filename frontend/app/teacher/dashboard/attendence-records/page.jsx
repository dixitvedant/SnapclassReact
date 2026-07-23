"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Users,
  BookOpen,
  BarChart3,
  CalendarDays,
  Search,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import TeacherAuthGuard from "../components/TeacherAuthGuard";

export default function AttendanceRecordsPage() {
  const [records, setRecords] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [classSummary, setClassSummary] = useState([]);
  const [studentSummary, setStudentSummary] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [dateFilter, setDateFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadAttendance();
  }, [limit]);

  async function loadAttendance() {
    const token = localStorage.getItem("teacher_token");

    const res = await fetch(
      "http://127.0.0.1:8000/attendance/teacher?limit=10",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (data.success) {
      setRecords(data.records || []);
      setDashboard(data.dashboard || {});
      setClassSummary(data.class_summary || []);
      setStudentSummary(data.student_summary || []);
    }

    setLoading(false);
  }

  const subjects = useMemo(() => {
    return [
      ...new Set(
        records
          .map((r) => r.attendence_sessions?.subject?.name)
          .filter(Boolean),
      ),
    ];
  }, [records]);

  const filtered = records.filter((r) => {
    const student = r.students?.name?.toLowerCase() || "";

    const subject = r.attendence_sessions?.subject?.name || "";

    const status = r.is_present ? "Present" : "Absent";

    const searchMatch = student.includes(search.toLowerCase());

    const subjectMatch = subjectFilter === "All" || subject === subjectFilter;

    const statusMatch = statusFilter === "All" || status === statusFilter;

    const d = new Date(r.timestamp);

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

    // CUSTOM RANGE

    if (fromDate && dateMatch) {
      dateMatch = d >= new Date(fromDate);
    }

    if (toDate && dateMatch) {
      const end = new Date(toDate);

      end.setHours(23, 59, 59);

      dateMatch = d <= end;
    }

    return searchMatch && subjectMatch && statusMatch && dateMatch;
  });

  const filteredClassSummary = classSummary.filter((c) => {
    const subjectMatch = subjectFilter === "All" || c.subject === subjectFilter;

    const d = new Date(c.lecture_time);

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

    // RANGE

    if (fromDate && dateMatch) {
      dateMatch = d >= new Date(fromDate);
    }

    if (toDate && dateMatch) {
      const end = new Date(toDate);

      end.setHours(23, 59, 59);

      dateMatch = d <= end;
    }

    return subjectMatch && dateMatch;
  });

  const filteredStudentSummary = studentSummary.filter((s) => {
    const searchMatch = s.student_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchedRecords = filtered.filter(
      (r) => r.student_id === s.student_id,
    );

    if (subjectFilter === "All") {
      return searchMatch && matchedRecords.length > 0;
    }

    return (
      searchMatch &&
      matchedRecords.some(
        (r) => r.attendence_sessions?.subject?.name === subjectFilter,
      )
    );
  });

  // =====================================
  // FILTERED DASHBOARD
  // =====================================

  const filteredDashboard = useMemo(() => {
    const students = filteredStudentSummary.length;

    const classes = filteredClassSummary.length;

    const avg = students
      ? (
          filteredStudentSummary.reduce(
            (sum, s) => sum + Number(s.attendance || 0),
            0,
          ) / students
        ).toFixed(1)
      : 0;

    const below75 = filteredStudentSummary.filter(
      (s) => s.attendance < 75,
    ).length;

    return {
      students,
      classes,
      average: avg,
      below75,
    };
  }, [filteredStudentSummary, filteredClassSummary]);

  function exportCSV() {
    const ws = XLSX.utils.json_to_sheet(studentSummary);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    XLSX.writeFile(wb, "attendance.csv");
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(studentSummary);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    XLSX.writeFile(wb, "attendance.xlsx");
  }

  function exportPDF() {
    const doc = new jsPDF();

    doc.text("Attendance Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Student", "Total", "Present", "Absent", "%"]],
      body: studentSummary.map((s) => [
        s.student_name,
        s.total_classes,
        s.present,
        s.absent,
        s.attendance,
      ]),
    });

    doc.save("attendance.pdf");
  }

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold text-violet-700">
        Loading Attendance...
      </div>
    );
  }

  return (
    <TeacherAuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-white p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900">
              Attendance Records
            </h1>

            <p className="text-slate-500 mt-2 text-lg">
              Teacher Attendance Analytics
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={exportCSV}
              className="h-12 px-5 rounded-2xl bg-violet-100 text-violet-700 font-semibold flex items-center gap-2"
            >
              <Download size={18} />
              CSV
            </button>

            <button
              onClick={exportExcel}
              className="h-12 px-5 rounded-2xl bg-fuchsia-100 text-fuchsia-700 font-semibold flex items-center gap-2"
            >
              <Download size={18} />
              Excel
            </button>

            <button
              onClick={exportPDF}
              className="h-12 px-5 rounded-2xl bg-rose-100 text-rose-700 font-semibold flex items-center gap-2"
            >
              <Download size={18} />
              PDF
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <Card
            title="Students"
            value={filteredDashboard.students}
            icon={<Users size={24} />}
          />
          <Card
            title="Classes"
            value={filteredDashboard.classes}
            icon={<BookOpen size={24} />}
          />
          <Card
            title="Avg %"
            value={`${filteredDashboard.average}%`}
            icon={<BarChart3 size={24} />}
          />
          <Card
            title="Below 75%"
            value={filteredDashboard.below75}
            icon={<CalendarDays size={24} />}
          />
        </div>

        <div className="bg-white rounded-[35px] shadow-xl border border-violet-100 p-6 mb-8 grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Student..."
              className="w-full h-12 rounded-2xl border-2 border-violet-200 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="h-12 rounded-2xl border-2 border-violet-200 px-4 text-slate-800"
          >
            <option>All</option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border-2 border-violet-200 px-4 text-slate-800"
          >
            <option>All</option>
            <option>Present</option>
            <option>Absent</option>
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

          <div className="flex items-center justify-center rounded-2xl bg-violet-100 text-violet-700 font-bold">
            Records: {filtered.length}
          </div>
        </div>

        <Section title="Students Below 75% Attendance">
          <Table>
            <thead className="bg-violet-100">
              <tr>
                <TH>Student ID</TH>
                <TH>Student Name</TH>
                <TH>Attendance %</TH>
              </tr>
            </thead>
            <tbody>
              {filteredStudentSummary
                .filter((s) => s.attendance < 75)
                .map((s) => (
                  <tr
                    key={s.student_id}
                    className="border-t hover:bg-violet-50"
                  >
                    <TD>{s.student_id}</TD>
                    <TD>{s.student_name}</TD>
                    <TD>
                      <span className="px-3 py-2 rounded-xl bg-rose-100 text-rose-700 font-semibold">
                        {s.attendance}%
                      </span>
                    </TD>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Section>

        <Section title="Class Attendance Summary">
          <Table>
            <thead className="bg-violet-100">
              <tr>
                <TH>Date & Time</TH>
                <TH>Subject</TH>
                <TH>Subject Code</TH>
                <TH>Attendance Stats</TH>
              </tr>
            </thead>
            <tbody>
              {[...filteredClassSummary]
                .sort(
                  (a, b) => new Date(b.lecture_time) - new Date(a.lecture_time),
                )
                .map((c) => (
                  <tr
                    key={c.session_id}
                    className="border-t hover:bg-violet-50"
                  >
                    <TD>
                      {(() => {
                        const d = new Date(c.lecture_time);

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
                    </TD>
                    {""}
                    <TD>{c.subject}</TD>
                    <TD>{c.subject_code}</TD>
                    <TD>
                      <span className="px-3 py-2 rounded-xl bg-violet-100 text-violet-700 font-semibold">
                        {c.present} / {c.total} Students
                      </span>
                    </TD>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Section>

        <Section title="Student Summary">
          <Table>
            <thead className="bg-violet-100">
              <tr>
                <TH>Student ID</TH>
                <TH>Student Name</TH>
                <TH>Present Count</TH>
                <TH>Absent Count</TH>
                <TH>Total Classes</TH>
                <TH>Attendance %</TH>
              </tr>
            </thead>
            <tbody>
              {filteredStudentSummary.map((s) => (
                <tr key={s.student_id} className="border-t hover:bg-violet-50">
                  <TD>{s.student_id}</TD>
                  <TD>{s.student_name}</TD>
                  <TD>{s.present}</TD>
                  <TD>{s.absent}</TD>
                  <TD>{s.total_classes}</TD>
                  <TD>{s.attendance}%</TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>

        {/* LOAD MORE */}

        <div
          className="
  flex
  justify-center
  mt-8
  "
        >
          <button
            onClick={() => setLimit(limit + 10)}
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
      </main>
    </TeacherAuthGuard>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white rounded-[30px] shadow-xl border border-violet-100 p-5">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-slate-500">{title}</p>
      <h2 className="text-4xl font-black text-slate-900 mt-2">{value}</h2>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-[35px] shadow-xl border border-violet-100 p-6 mb-8">
      <h2 className="text-3xl font-black text-slate-900 mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Table({ children }) {
  return (
    <div className="overflow-auto max-h-[450px] rounded-3xl border border-violet-100">
      <table className="w-full">{children}</table>
    </div>
  );
}

function TH({ children }) {
  return <th className="px-6 py-4 text-left text-slate-800">{children}</th>;
}

function TD({ children }) {
  return <td className="px-6 py-4 text-slate-700">{children}</td>;
}
