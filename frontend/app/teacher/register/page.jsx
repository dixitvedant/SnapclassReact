"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Users, User, Lock, Mail, ArrowLeft } from "lucide-react";

export default function TeacherRegister() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // VALIDATION

    if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/teacher/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        toast.success("Teacher Registered");

        router.push("/teacher/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
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
      {/* Blur */}

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
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
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
            Teacher Register
          </h1>

          <p
            className="
            text-slate-500
            mt-2
            text-lg
            "
          >
            Create ERP account
          </p>
        </div>

        {/* Form */}

        <div
          className="
          mt-8
          space-y-5
          "
        >
          {/* Name */}

          <Input
            icon={<User size={20} />}
            placeholder="Full Name"
            value={name}
            onChange={setName}
          />

          {/* Email */}

          <Input
            icon={<Mail size={20} />}
            placeholder="Email"
            value={email}
            onChange={setEmail}
          />

          {/* Username */}

          <Input
            icon={<User size={20} />}
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />

          {/* Password */}

          <Input
            icon={<Lock size={20} />}
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {/* Register */}

          <button
            onClick={handleRegister}
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
            "
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        {/* Back */}

        <Link
          href="/teacher/login"
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
          Back to Login
        </Link>
      </motion.div>
    </main>
  );
}

function Input({ icon, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="relative">
      <div
        className="
        absolute
        left-5
        top-1/2
        -translate-y-1/2
        text-slate-400
        "
      >
        {icon}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  );
}
