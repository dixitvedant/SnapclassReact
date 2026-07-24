"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

import { GraduationCap, Camera } from "lucide-react";

export default function StudentLogin() {
  const router = useRouter();

  const webcamRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [credentialVerified, setCredentialVerified] = useState(false);

  const [studentId, setStudentId] = useState(null);

  //Verify Credentials before Face Login

  async function verifyCredentials() {
    if (!username || !password) {
      toast.error("Enter Username and Password");
      return;
    }

    try {
      const response = await apiFetch("/student-auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("student_id", result.student_id);

      setStudentId(result.student_id);

      setCredentialVerified(true);

      toast.success("Credentials Verified");
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    }
  }
  // ======================
  // FACE LOGIN
  // ======================

  const handleFaceLogin = async () => {
    if (!webcamRef.current || loading) return;

    setLoading(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        setLoading(false);
        return;
      }

      const blob = await fetch(imageSrc).then((r) => r.blob());

      const formData = new FormData();

      formData.append("file", blob, "face.jpg");

      const response = await apiFetch("/face/login", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log(data);

      // ===================
      // FACE FOUND
      // ===================

      if (data.success && data.student_id === studentId) {
        localStorage.setItem("student_id", data.student_id);

        localStorage.setItem("auth", "true");

        router.push("/student/dashboard");
      }

      // ===================
      // FACE FAIL
      // ===================
      else {
        toast.error("Face Not Recognized. Please try again.");

        router.push("/student/register");
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
      px-6
      py-10
      relative
      overflow-hidden
      bg-gradient-to-br
      from-blue-50
      via-white
      to-violet-50
      "
    >
      {/* Glow */}

      <div
        className="
        absolute
        top-0
        left-0
        w-96
        h-96
        bg-blue-300/30
        blur-[120px]
        rounded-full
        "
      />

      <div
        className="
        absolute
        bottom-0
        right-0
        w-96
        h-96
        bg-violet-300/30
        blur-[120px]
        rounded-full
        "
      />

      <div
        className="
        w-full
        max-w-md
        relative
        z-10
        "
      >
        {/* Logo */}

        <div
          className="
          flex
          items-center
          justify-center
          gap-4
          mb-8
          "
        >
          <div
            className="
            w-16
            h-16
            rounded-3xl
            bg-gradient-to-br
            from-blue-600
            to-cyan-500
            flex
            items-center
            justify-center
            text-white
            shadow-xl
            "
          >
            <GraduationCap size={30} />
          </div>

          <div>
            <h1
              className="
              text-3xl
              font-black
              text-slate-900
              "
            >
              Smart
              <span
                className="
                text-blue-600
                "
              >
                Attend
              </span>
            </h1>

            <p
              className="
              text-slate-500
              text-sm
              "
            >
              AI-Based Biometric Authentication Module{" "}
            </p>
          </div>
        </div>

        {/* Card */}

        <div
          className="
          bg-white/80
          backdrop-blur-3xl
          rounded-[36px]
          border
          border-white/60
          shadow-[0_20px_60px_rgba(0,0,0,.10)]
          p-8
          "
        >
          <div
            className="
            text-center
            "
          >
            <Camera
              size={42}
              className="
              mx-auto
              text-blue-600
              "
            />

            <h2
              className="
              text-4xl
              font-black
              text-slate-900
              mt-4
              "
            >
              Face Login
            </h2>

            <p
              className="
              text-slate-500
              mt-2
              "
            >
              Looking for your face...
            </p>
          </div>

          <div
            className="
            mt-6
            "
          >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="
              w-full
              h-14
              px-5
              rounded-2xl
              border
              border-slate-300
              mb-3
              text-slate-900
            "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                h-14
                px-5
                rounded-2xl
                border
                border-slate-300
                mb-3
                text-slate-900
              "
            />

            <button
              onClick={verifyCredentials}
              className="
  w-full
  h-14
  rounded-2xl
  bg-gradient-to-r
  from-blue-600
  to-cyan-500
  text-white
  font-bold
"
            >
              Verify Credentials
            </button>
            {credentialVerified && (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="
    rounded-3xl
    w-full
    border
    border-slate-200
    "
              />
            )}
          </div>

          {/* Buttons */}

          <div className="mt-5 space-y-3">
            {/* Scan Again */}

            {credentialVerified && (
              <button
                onClick={handleFaceLogin}
                disabled={loading}
                className="
      w-full
      h-14
      rounded-2xl
      bg-gradient-to-r
      from-blue-600
      to-cyan-500
      text-white
      font-bold
      shadow-lg
      "
              >
                {loading ? "Checking Face..." : "Scan Face"}
              </button>
            )}
            <button
              onClick={() => router.push("/forgot-password")}
              className="
  w-full
  text-blue-600
    font-semibold

  text-sm
  mt-3
  "
            >
              Forgot Password?
            </button>
            {/* Home */}

            <button
              onClick={() => router.push("/")}
              className="
    w-full
    h-14
    rounded-2xl
    border-2
    border-blue-200
    bg-white/80
    text-blue-700
    font-semibold
    hover:bg-blue-50
    transition
    "
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
