"use client";

import { usePathname } from "next/navigation";
import StudentSidebar from "./components/StudentSidebar";
import AuthGuard from "./components/AuthGuard";

export default function StudentLayout({ children }) {
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/student/login" ||
    pathname === "/student/register" ||
    pathname === "/student/forgot-password";

  if (hideSidebar) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <AuthGuard>
      <main
        className="
      min-h-screen
      bg-slate-100
      flex
      "
      >
        <StudentSidebar />

        <section className="flex-1 p-8">{children}</section>
      </main>
    </AuthGuard>
  );
}
