"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users
} from "lucide-react";

export default function PortalCards() {

  const router = useRouter();

  return (

    <section
      className="
      max-w-4xl
      mx-auto
      grid
      md:grid-cols-2
      gap-10
      mt-16
      px-6
      "
    >

      <Card
        icon={<GraduationCap size={44} />}
        title="I'm a Student"
        text="Access attendance, dashboard and subjects"
        color="from-blue-600 to-cyan-500"
        onClick={() =>
          router.push(
            "/student/login"
          )
        }
      />

      <Card
        icon={<Users size={44} />}
        title="I'm a Teacher"
        text="Manage attendance and ERP controls"
        color="from-violet-600 to-purple-500"
        onClick={() =>
          router.push(
            "/teacher/login"
          )
        }
      />

    </section>
  );
}

function Card({
  icon,
  title,
  text,
  color,
  onClick
}) {

  return (

    <motion.div

      whileHover={{
        y: -10
      }}

      className="
      bg-white/80
      backdrop-blur-2xl
      rounded-[36px]
      p-10
      shadow-[0_12px_40px_rgba(0,0,0,.10)]
      border
      border-slate-200/70
      "
    >

      <div
        className={`
        w-24
        h-24
        rounded-3xl
        bg-gradient-to-br
        ${color}
        text-white
        flex
        items-center
        justify-center
        shadow-lg
        `}
      >
        {icon}
      </div>

      <h3
        className="
        text-4xl
        font-extrabold
        mt-8
        text-slate-900
        "
      >
        {title}
      </h3>

      <p
        className="
        text-slate-700
        mt-3
        text-lg
        font-medium
        "
      >
        {text}
      </p>

      <button
        onClick={onClick}
        className={`
        mt-8
        w-full
        py-4
        rounded-2xl
        text-white
        text-lg
        font-semibold
        bg-gradient-to-r
        ${color}
        shadow-lg
        hover:scale-[1.02]
        transition
        `}
      >
        Open Portal
      </button>

    </motion.div>
  );
}