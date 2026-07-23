"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherAuthGuard({ children }) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("teacher_token");

    const teacherId = localStorage.getItem("teacher_id");

    if (!token || !teacherId) {
      router.replace("/teacher/login");

      return;
    }

    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-2xl
        font-bold
        "
      >
        Checking Login...
      </div>
    );
  }

  return children;
}
