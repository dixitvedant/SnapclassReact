"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Hero() {

  return (

    <section
      className="
      relative
      max-w-6xl
      mx-auto
      text-center
      pt-56
      px-6
      "
    >

      <motion.div

        initial={{
          opacity: 0,
          scale: .8
        }}

        animate={{
          opacity: 1,
          scale: 1
        }}

        className="
        inline-flex
        items-center
        gap-2
        px-6
        py-3
        rounded-full
        bg-white/70
        backdrop-blur-xl
        shadow-lg
        text-blue-600
        font-semibold
        "
      >
        <Sparkles size={18} />
        AI • Face Recognition • Voice Recognition
      </motion.div>

      <h1
        className="
        text-7xl
        md:text-7xl
        font-black
        mt-10
        text-slate-900
        "
      >
        Smart Attendance
      </h1>

      <h2
        className="
        text-7xl
        md:text-5xl
        font-black
        bg-gradient-to-r
        from-blue-600
        to-violet-600
        bg-clip-text
        text-transparent
        "
      >
        Made Simple
      </h2>

      <p
        className="
        text-2xl
        text-slate-600
        mt-7
        "
      >
        AI-powered attendance platform for
        students, teachers and institutions.
      </p>

    </section>
  );
}