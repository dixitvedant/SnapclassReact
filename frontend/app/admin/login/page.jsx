"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function login() {
    if (!username || !password) {
      toast.error("Enter Username and Password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("admin_token", data.token);

        localStorage.setItem(
          "admin_data",
          JSON.stringify(data.admin)
        );

        toast.success("Welcome Admin");

        router.push("/admin/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    }

    setLoading(false);
  }

  return (
    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-violet-50
      via-white
      to-blue-50
      p-8
      "
    >
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
        w-full
        max-w-md
        rounded-[40px]
        bg-white
        shadow-2xl
        p-10
        "
      >
        <div className="text-center">
          <div
            className="
            w-24
            h-24
            rounded-[30px]
            mx-auto
            bg-gradient-to-br
            from-violet-600
            to-blue-600
            flex
            items-center
            justify-center
            "
          >
            <ShieldCheck
              size={42}
              className="text-white"
            />
          </div>

          <h1
            className="
            mt-8
            text-5xl
            font-black
            text-slate-900
            "
          >
            Admin Login
          </h1>

          <p
            className="
            mt-2
            text-slate-500
            "
          >
            SmartAttend Administration
          </p>
        </div>

        <div className="mt-10 space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="
            w-full
            h-14
            rounded-2xl
            border
            px-4
            text-slate-900
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
            w-full
            h-14
            rounded-2xl
            border
            px-4
            text-slate-900
            "
          />

          <button
            onClick={login}
            className="
            w-full
            h-14
            rounded-2xl
            text-white
            font-bold
            bg-gradient-to-r
            from-violet-600
            to-blue-600
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}