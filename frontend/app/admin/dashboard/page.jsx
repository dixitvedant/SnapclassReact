"use client";

import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
} from "lucide-react";

import StatCard from "./components/StatCard";
import AttendanceChart from "./components/AttendanceChart";
import RecentRegistrations from "./components/RecentRegistrations";
import QuickActions from "./components/QuickActions";
import LatestNotifications from "./components/LatestNotifications";
import RecentAnnouncements from "./components/RecentAnnouncements";
import DefaultersSummary from "./components/DefaultersSummary";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      {/* ================= Header ================= */}

      <div>

        <h2
          className="
          text-3xl
          font-black
          text-slate-900
          "
        >
          Dashboard Overview
        </h2>

        <p
          className="
          mt-2
          text-slate-500
          "
        >
          Monitor your institute statistics and activities.
        </p>

      </div>

      {/* ================= Statistics ================= */}

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
        "
      >

        <StatCard
          title="Students"
          value="1,248"
          change="+12%"
          icon={GraduationCap}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Teachers"
          value="58"
          change="+3"
          icon={Users}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
        />

        <StatCard
          title="Subjects"
          value="42"
          change="+5"
          icon={BookOpen}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />

        <StatCard
          title="Today's Attendance"
          value="94%"
          change="+2.4%"
          icon={CalendarCheck}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />

      </div>

      {/* ================= Row 2 ================= */}

      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
        "
      >

        <div className="xl:col-span-2">

          <AttendanceChart />

        </div>

        <RecentRegistrations />

      </div>

      {/* ================= Row 3 ================= */}

      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
        "
      >

        <div className="xl:col-span-2">

          <QuickActions />

        </div>

        <LatestNotifications />

      </div>

      {/* ================= Row 4 ================= */}

      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        "
      >

        <RecentAnnouncements />

        <DefaultersSummary />

      </div>

    </div>
  );
}