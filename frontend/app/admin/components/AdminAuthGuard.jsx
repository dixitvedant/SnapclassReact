"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminAuthGuard({ children }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-2xl
        font-bold
        text-slate-700
        "
      >
        Loading...
      </div>
    );
  }

  return children;
}