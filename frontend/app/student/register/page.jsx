"use client";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Camera, Home } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function StudentRegister() {
  const router = useRouter();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    student_email: "",
    parent_email: "",
    parent_mobile: "",
  });

  const [loading, setLoading] = useState(false);

  // CAMERA START
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error("Camera permission denied. Allow camera access.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // REGISTER
  const handleRegister = async () => {
    if (
      !form.name ||
      !form.username ||
      !form.password ||
      !form.student_email ||
      !form.parent_email ||
      !form.parent_mobile
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const canvas = canvasRef.current;

      const video = videoRef.current;

      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg"),
      );

      const data = new FormData();

      data.append("username", form.username);

      data.append("password", form.password);

      data.append("name", form.name);

      data.append("student_email", form.student_email);

      data.append("parent_email", form.parent_email);

      data.append("parent_mobile", form.parent_mobile);

      data.append("image", blob, "face.jpg");

      const response = await apiFetch("/student/register", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      console.log(result);

      if (result.success) {
        toast.success("Registration Success");

        stopCamera();

        router.push("/student/login");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Registration Failed");
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
      bg-gradient-to-br
      from-blue-50
      via-white
      to-violet-50
      p-6
      "
    >
      <canvas ref={canvasRef} hidden />

      <div
        className="
        w-full
        max-w-xl
        bg-white/90
        backdrop-blur-2xl
        rounded-[36px]
        shadow-[0_20px_60px_rgba(0,0,0,.12)]
        p-8
        "
      >
        <div
          className="
          flex
          items-center
          gap-4
          mb-6
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
            text-white
            flex
            items-center
            justify-center
            "
          >
            <GraduationCap />
          </div>

          <div>
            <h1
              className="
              text-3xl
              font-black
              text-slate-900
              "
            >
              Student Register
            </h1>

            <p
              className="
              text-slate-500
              "
            >
              Enroll face and profile
            </p>
          </div>
        </div>

        {/* FORM */}

        <div className="space-y-4">
          {/* Student Name */}

          <input
            placeholder="Student Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="
    w-full
    h-14
    px-5
    rounded-2xl
    border
    border-slate-200
    text-slate-900
    "
          />

          {/* Username */}

          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value,
              })
            }
            className="
    w-full
    h-14
    px-5
    rounded-2xl
    border
    border-slate-200
    text-slate-900
    "
          />

          {/* Password */}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="
    w-full
    h-14
    px-5
    rounded-2xl
    border
    border-slate-200
    text-slate-900
    "
          />

          {/* Student Email */}

          <input
            placeholder="Student Email"
            value={form.student_email}
            onChange={(e) =>
              setForm({
                ...form,
                student_email: e.target.value,
              })
            }
            className="
              w-full
              h-14
              px-5
              rounded-2xl
              border
              border-slate-200
              text-slate-900
              "
          />
          {/* Parent Email */}
          <input
            placeholder="Parent Email"
            value={form.parent_email}
            onChange={(e) =>
              setForm({
                ...form,
                parent_email: e.target.value,
              })
            }
            className="
  w-full
  h-14
  px-5
  rounded-2xl
  border
  border-slate-200
  text-slate-900
  "
          />

          {/* Parent Mobile */}
          <input
            placeholder="Parent Mobile"
            value={form.parent_mobile}
            onChange={(e) =>
              setForm({
                ...form,
                parent_mobile: e.target.value,
              })
            }
            className="
  w-full
  h-14
  px-5
  rounded-2xl
  border
  border-slate-200
  text-slate-900
  "
          />
        </div>

        {/* CAMERA */}

        <div
          className="
          mt-6
          rounded-3xl
          overflow-hidden
          border
          border-slate-200
          "
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="
            w-full
            h-[320px]
            object-cover
            "
          />
        </div>

        {/* BUTTONS */}

        <div
          className="
          mt-6
          space-y-3
          "
        >
          <button
            onClick={handleRegister}
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
            {loading ? "Registering..." : "Register Face"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="
            w-full
            h-14
            rounded-2xl
            border-2
            border-blue-200
            text-blue-700
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            "
          >
            <Home size={18} />
            Go Home
          </button>
        </div>
      </div>
    </main>
  );
}
