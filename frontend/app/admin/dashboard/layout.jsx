"use client";

import AdminAuthGuard from "../components/AdminAuthGuard";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboardLayout({
  children,
}) {
  return (
    <AdminAuthGuard>
      <main
        className="
        min-h-screen
        flex
        bg-gradient-to-br
        from-slate-50
        via-emerald-50/30
        to-slate-100
        overflow-hidden
        "
      >
        <AdminSidebar />

        <div
          className="
          flex-1
          flex
          flex-col
          min-h-screen
          "
        >
          <AdminNavbar />

          <div
            className="
            flex-1
            overflow-auto
            px-8
            pt-4
            pb-8
            "
          >
            {children}
          </div>
        </div>
      </main>
    </AdminAuthGuard>
  );
}