"use client";

import { motion } from "framer-motion";

import {
  ArrowUpRight,
} from "lucide-react";

export default function StatCard({

  title,

  value,

  change,

  icon: Icon,

  iconBg,

  iconColor,

  trendColor = "text-emerald-600",

}) {
  return (

    <motion.div

      whileHover={{
        y: -8,
        scale: 1.02,
      }}

      transition={{
        duration: 0.25,
      }}

      className="
      relative
      overflow-hidden
      rounded-[28px]
      bg-white/75
      backdrop-blur-xl
      border
      border-white
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-300
      p-6
      "
    >

      {/* Decorative Glow */}

      <div
        className="
        absolute
        -right-10
        -top-10
        h-36
        w-36
        rounded-full
        bg-emerald-100/40
        blur-3xl
        "
      />

      {/* Top Row */}

      <div
        className="
        flex
        items-start
        justify-between
        relative
        z-10
        "
      >

        <div>

          <p
            className="
            text-sm
            font-semibold
            uppercase
            tracking-wide
            text-slate-500
            "
          >
            {title}
          </p>

          <h2
            className="
            mt-3
            text-4xl
            font-black
            text-slate-900
            "
          >
            {value}
          </h2>

        </div>

        <div
          className={`
          h-16
          w-16
          rounded-2xl
          flex
          items-center
          justify-center
          shadow-lg
          ${iconBg}
          `}
        >

          <Icon
            size={30}
            className={iconColor}
          />

        </div>

      </div>

      {/* Bottom */}

      <div
        className="
        relative
        z-10
        mt-8
        flex
        items-center
        justify-between
        "
      >

        <div
          className={`
          flex
          items-center
          gap-1
          text-sm
          font-bold
          ${trendColor}
          `}
        >

          <ArrowUpRight size={17} />

          {change}

        </div>

        <span
          className="
          text-sm
          text-slate-400
          "
        >
          Compared to last month
        </span>

      </div>

    </motion.div>

  );
}