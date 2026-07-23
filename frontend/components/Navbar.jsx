"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <motion.nav
      initial={{
        y: -50,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      className="
      fixed
      top-5
      left-1/2
      -translate-x-1/2
      z-50
      w-[95%]
      max-w-7xl
      px-8
      py-4
      rounded-[30px]
      bg-white/75
      backdrop-blur-3xl
      border
      border-white/50
      shadow-[0_10px_40px_rgba(0,0,0,.08)]
      flex
      items-center
      justify-between
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
          w-16
          h-16
          rounded-3xl
          bg-gradient-to-br
          from-blue-600
          to-violet-600
          flex
          items-center
          justify-center
          shadow-lg
          "
        >
          <GraduationCap className="text-white" size={28} />
        </div>

        <div>
          <h1
            className="
            text-3xl
            font-black
            text-slate-900
            leading-none
            "
          >
            Smart
            <span className="text-blue-600">Attend</span>
          </h1>

          <p className="text-slate-500 text-sm mt-1">AI Attendance System</p>
        </div>
      </div>

      <div
        className="
        hidden
        md:flex
        items-center
        gap-10
        text-slate-700
        font-semibold
        "
      >
        <a className="hover:text-blue-600 transition">Home</a>

        <a className="hover:text-blue-600 transition">Features</a>

        <a className="hover:text-blue-600 transition">About</a>

        <a className="hover:text-blue-600 transition">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/login")}
          className="
            px-6
            py-3
            rounded-2xl
            border
            border-blue-200
            bg-white/80
            text-slate-800
            font-semibold
            hover:bg-blue-50
            transition
            "
        >
          Admin Login
        </button>

        <button
          className="
          px-6
          py-3
          rounded-2xl
          text-white
          font-semibold
          bg-gradient-to-r
          from-blue-600
          to-violet-600
          shadow-lg
          hover:scale-105
          transition
          "
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  );
}
