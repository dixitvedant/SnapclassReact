"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================
  // SEND OTP
  // =====================

  const sendOtp = async () => {
    if (!username) {
      toast.error("Enter Username");

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/student-forgot/send-otp",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
          }),
        },
      );

      const result = await res.json();

      if (result.success) {
        toast.success("OTP Sent To Email");

        setStep(2);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // VERIFY OTP
  // =====================

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/student-forgot/verify-otp",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            otp,
          }),
        },
      );

      const result = await res.json();

      if (result.success) {
        toast.success("OTP Verified");

        setStep(3);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // RESET PASSWORD
  // =====================

  const resetPassword = async () => {
    if (!newPassword) {
      toast.error("Enter New Password");

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/student-forgot/reset-password",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            new_password: newPassword,
          }),
        },
      );

      const result = await res.json();

      if (result.success) {
        toast.success("Password Reset Successful");

        router.push("/student/login");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-blue-50
      via-white
      to-violet-50
      p-6
      "
    >
      <div
        className="
        w-full
        max-w-md
        bg-white
        rounded-[32px]
        shadow-xl
        p-8
        "
      >
        <h1
          className="
          text-3xl
          font-black
          text-center
          mb-6
          text-slate-900
          "
        >
          Forgot Password
        </h1>

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="
              w-full
              h-14
              px-4
              rounded-2xl
              border
              border-slate-300
              text-slate-900
              "
            />

            <button
              onClick={sendOtp}
              className="
              w-full
              h-14
              mt-4
              rounded-2xl
              bg-blue-600
              text-white
              font-bold
              text-slate-900
              "
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="
              w-full
              h-14
              px-4
              rounded-2xl
              border
              border-slate-300
              text-slate-900
              "
            />

            <button
              onClick={verifyOtp}
              className="
              w-full
              h-14
              mt-4
              rounded-2xl
              bg-green-600
              text-white
              font-bold
              text-slate-900
              "
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="
              w-full
              h-14
              px-4
              rounded-2xl
              border
              border-slate-300
              text-slate-900
              "
            />

            <button
              onClick={resetPassword}
              className="
              w-full
              h-14
              mt-4
              rounded-2xl
              bg-purple-600
              text-white
              font-bold
              text-slate-900
              "
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        <button
          onClick={() => router.push("/student/login")}
          className="
          w-full
          h-12
          mt-5
          rounded-2xl
          border
          border-slate-300
          text-slate-900
          "
        >
          Back To Login
        </button>
      </div>
    </main>
  );
}
