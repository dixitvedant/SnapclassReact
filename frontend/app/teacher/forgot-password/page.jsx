"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import { Users, Mail, KeyRound, Lock, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  // =========================
  // SEND OTP
  // =========================

  const sendOtp = async () => {
    if (!email.trim()) {
      toast.error("Enter Email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/teacher-forgot/send-otp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("OTP Sent");

        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    }

    setLoading(false);
  };

  // =========================
  // VERIFY OTP
  // =========================

  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/teacher-forgot/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("OTP Verified");

        setStep(3);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    }

    setLoading(false);
  };

  // =========================
  // RESET PASSWORD
  // =========================

  const resetPassword = async () => {
    if (!newPassword) {
      toast.error("Enter Password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/teacher-forgot/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            new_password: newPassword,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Password Reset Successful");

        router.push("/teacher/login");
      } else {
        toast.error(data.message);
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
        max-w-[520px]
        bg-white/80
        backdrop-blur-3xl
        rounded-[42px]
        p-10
        shadow-lg
        "
      >
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
            "
          >
            <Users size={40} />
          </div>

          <h1
            className="
            text-5xl
            font-black
            mt-7
            text-slate-900
            "
          >
            Forgot Password
          </h1>

          <p
            className="
            text-slate-500
            mt-2
            "
          >
            Teacher Account Recovery
          </p>
        </div>

        {/* STEP 1 */}

        {step === 1 && (
          <div className="mt-8 text-slate-900">
            <input
              type="email"
              placeholder="Teacher Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
              w-full
              h-14
              border
              rounded-2xl
              px-4
              "
            />

            <button
              onClick={sendOtp}
              className="
              mt-4
              w-full
              h-14
              rounded-2xl
              bg-violet-600
              text-white
              font-semibold
              "
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <div className="mt-8 text-slate-900">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="
              w-full
              h-14
              border
              rounded-2xl
              px-4
              "
            />

            <button
              onClick={verifyOtp}
              className="
              mt-4
              w-full
              h-14
              rounded-2xl
              bg-violet-600
              text-white
              font-semibold
              text-slate-900
              "
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <div className="mt-8 space-y-4 text-slate-900">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="
              w-full
              h-14
              border
              rounded-2xl
              px-4
              text-slate-900
              "
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
              w-full
              h-14
              border
              rounded-2xl
              px-4
              "
            />

            <button
              onClick={resetPassword}
              className="
              w-full
              h-14
              rounded-2xl
              bg-green-600
              text-white
              font-semibold
              text-slate-900
              "
            >
              Reset Password
            </button>
          </div>
        )}

        <Link
          href="/teacher/login"
          className="
          mt-7
          flex
          items-center
          justify-center
          gap-2
          text-violet-600
          "
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </motion.div>
    </main>
  );
}
