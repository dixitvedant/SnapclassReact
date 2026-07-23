"use client";

import { useEffect } from "react";

import { useRouter }
from "next/navigation";

import {
  isTokenExpired
}
from "@/lib/token";

export default function AuthGuard({

  children

}) {

  const router =
    useRouter();

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    const studentId =
      localStorage.getItem(
        "student_id"
      );

    if (

      !token ||

      !studentId ||

      isTokenExpired(token)

    ) {

      localStorage.clear();

      router.replace(
        "/student/login"
      );

    }

  }, []);

  return children;
}