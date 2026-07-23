"use client";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  User,
  Lock,
  ArrowLeft
} from "lucide-react";

export default function TeacherLogin() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    // =========================
    // VALIDATION
    // =========================

    if (
      !username.trim() &&
      !password.trim()
    ) {
      alert("Fill all fields");
      return;
    }

    if (!username.trim()) {
      alert(
        "Please enter username"
      );
      return;
    }

    if (!password.trim()) {
      alert(
        "Please enter password"
      );
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/teacher/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data =
        await response.json();

      console.log(data);

      if (data.success) {
        localStorage.setItem(
          "teacher_data",
          JSON.stringify(
            data.teacher
          )
        );

        localStorage.setItem(
          "teacher_id",
          data.teacher.teacher_id
        );

        localStorage.setItem(
          "teacher_name",
          data.teacher.name
        );

        localStorage.setItem(
          "teacher_token",
          data.token
        );

        toast.success(
        "Teacher Login Successful"
        );

        router.push(
          "/teacher/dashboard"
        );

      } else {

      toast.error(
      "Invalid Username or password"
      )
      }

    } catch (err) {

      console.log(err);

      alert(
        "Server Error"
      );
    }

    setLoading(false);
  };

  return (
    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      px-6
      py-12
      bg-gradient-to-br
      from-[#eef4ff]
      via-[#f6f7ff]
      to-[#f1efff]
      relative
      overflow-hidden
      "
    >

      {/* Blur Background */}

      <div
        className="
        absolute
        top-[-120px]
        left-[-120px]
        w-[380px]
        h-[380px]
        bg-violet-300/25
        blur-[120px]
        rounded-full
        "
      />

      <div
        className="
        absolute
        bottom-[-120px]
        right-[-100px]
        w-[350px]
        h-[350px]
        bg-purple-300/20
        blur-[120px]
        rounded-full
        "
      />

      {/* Card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="
        relative
        z-10
        w-full
        max-w-[520px]
        bg-white/80
        backdrop-blur-3xl
        rounded-[42px]
        p-10
        shadow-[0_20px_70px_rgba(0,0,0,.12)]
        border
        border-white/60
        "
      >

        {/* Logo */}

        <div className="text-center">

          <div
            className="
            w-24
            h-24
            mx-auto
            rounded-[30px]
            bg-gradient-to-br
            from-violet-600
            to-purple-500
            flex
            items-center
            justify-center
            text-white
            shadow-xl
            "
          >
            <Users size={40} />
          </div>

          <h1
            className="
            text-5xl
            font-black
            text-slate-900
            mt-7
            "
          >
            Teacher Login
          </h1>

          <p
            className="
            text-slate-500
            mt-2
            text-lg
            "
          >
            Manage attendance & ERP
          </p>

        </div>

        {/* Form */}

        <div className="mt-8 space-y-5">

          {/* Username */}

          <div className="relative">

            <User
              size={20}
              className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              className="
              w-full
              h-[64px]
              pl-14
              pr-4
              rounded-3xl
              bg-white/85
              border
              border-slate-200
              text-slate-800
              placeholder:text-slate-400
              shadow-sm
              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-100
              outline-none
              transition
              "
            />

          </div>

          {/* Password */}

          <div className="relative">

            <Lock
              size={20}
              className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              text-slate-400
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
              w-full
              h-[64px]
              pl-14
              pr-4
              rounded-3xl
              bg-white/85
              border
              border-slate-200
              text-slate-800
              placeholder:text-slate-400
              shadow-sm
              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-100
              outline-none
              transition
              "
            />

          </div>

          {/* Remember + Forgot */}

          <div
            className="
            flex
            items-center
            justify-between
            text-sm
            "
          >

            <label
              className="
              flex
              items-center
              gap-2
              text-slate-600
              "
            >
              <input type="checkbox" />
              Remember me
            </label>

            <button
              onClick={() =>
              router.push(
                "/teacher/forgot-password"
              )
            }
              className="
              text-violet-600
              hover:underline
              "
            >
              Forgot?
            </button>

          </div>

          {/* Buttons */}

          <div className="space-y-4">

            {/* Login */}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="
              w-full
              h-[64px]
              rounded-3xl
              text-white
              text-xl
              font-bold
              bg-gradient-to-r
              from-violet-600
              to-purple-500
              shadow-[0_12px_30px_rgba(124,58,237,.35)]
              hover:scale-[1.02]
              transition
              disabled:opacity-70
              "
            >
              {
                loading
                ? "Signing In..."
                : "Login"
              }
            </button>

            {/* Register */}

            <button
              onClick={() =>
              router.push(
                "/teacher/register"
              )
            }
              className="
              w-full
              h-[64px]
              rounded-3xl
              text-lg
              font-semibold
              border-2
              border-violet-200
              bg-white/80
              text-violet-700
              hover:bg-violet-50
              hover:border-violet-400
              shadow-md
              transition
              "
            >
              Register
            </button>

          </div>

        </div>

        {/* Back */}

        <Link
          href="/"
          className="
          mt-7
          flex
          items-center
          justify-center
          gap-2
          text-violet-600
          font-medium
          hover:underline
          "
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

      </motion.div>

    </main>
  );
}