"use client";

import {
  Camera,
  Users,
  CheckCircle2,
  Play,
  Save,
  Upload,
  ScanFace,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import TeacherAuthGuard from "../components/TeacherAuthGuard";

function Card({ title, value, icon }) {
  return (
    <div
      className="
      rounded-[32px]
      bg-white/75
      backdrop-blur-3xl
      border
      border-white/60
      shadow-lg
      p-6
      "
    >
      <div
        className="
        flex
        justify-between
        items-center
        "
      >
        <div>
          <p
            className="
            text-slate-600
            font-semibold
            "
          >
            {title}
          </p>

          <h3
            className="
            text-5xl
            font-extrabold
            tracking-tight
            text-slate-900
            mt-2
            "
          >
            {value}
          </h3>
        </div>

        <div
          className="
          w-14
          h-14
          rounded-2xl
          bg-violet-100
          text-violet-700
          flex
          items-center
          justify-center
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const [attendanceTable, setAttendanceTable] = useState([]);

  const [subject, setSubject] = useState("");

  const [subjects, setSubjects] = useState([]);

  const [cameraOn, setCameraOn] = useState(false);

  const [photos, setPhotos] = useState([]);

  const [recognized, setRecognized] = useState([]);

  const [loading, setLoading] = useState(false);

  const [presentCount, setPresentCount] = useState(0);

  const videoRef = useRef(null);

  const streamRef = useRef(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (cameraOn) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());

        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraOn]);
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const token = localStorage.getItem("teacher_token");

        const res = await fetch("http://127.0.0.1:8000/subject/teacher", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("Subjects:", data);

        if (data.success) {
          setSubjects(data.subjects);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadSubjects();
  }, []);

  const uploadPhotos = (e) => {
    const files = Array.from(e.target.files);

    const newPhotos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");

    canvas.width = videoRef.current.videoWidth;

    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `capture-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      setPhotos((prev) => [
        ...prev,
        {
          file,
          url: URL.createObjectURL(file),
        },
      ]);
    }, "image/jpeg");
  };

  const removePhoto = (i) => {
    setPhotos(photos.filter((_, idx) => idx !== i));
  };
  const runAnalysis = async () => {
    try {
      if (photos.length === 0) {
        toast.error("Please upload or capture photos first");

        return;
      }

      setLoading(true);

      const formData = new FormData();

      photos.forEach((img) => {
        formData.append("images", img.file);
        formData.append("subject_id", subject);
      });

      const token = localStorage.getItem("teacher_token");

      const response = await fetch("http://127.0.0.1:8000/attendance/analyze", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      console.log(data);

      if (response.ok && data.success) {
        setRecognized(data.recognized || data.students || []);

        setPresentCount(data.present_count || 0);

        setAttendanceTable(data.attendance || []);

        toast(`Recognized ${data.present_count} student(s)`);
      } else {
        toast.error("Face analysis failed");
      }
    } catch (err) {
      console.log(err);

      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };
  const saveAttendance = async () => {
    try {
      const token = localStorage.getItem("teacher_token");

      console.log("Subject:", subject);

      console.log("AttendanceTable:", attendanceTable);

      if (!token) {
        toast.error("Please login again");

        return;
      }

      if (!subject) {
        toast.error("Select subject");

        return;
      }

      if (attendanceTable.length === 0) {
        toast.error("No attendance data");

        return;
      }

      const attendance = attendanceTable.map((row) => ({
        student_id: row.student_id,

        status: row.status,

        source: row.source || "-",
      }));

      console.log("Sending:", attendance);

      const res = await fetch("http://127.0.0.1:8000/attendance/save", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          subject_id: Number(subject),

          attendance,
        }),
      });

      const data = await res.json();

      console.log("Backend Response:", data);

      if (res.ok && data.success) {
        toast.success(`Attendance Taken • ${data.mail_sent} mail(s) sent`);

        // RESET

        setAttendanceTable([]);

        setRecognized([]);

        setPresentCount(0);

        setPhotos([]);

        setCameraOn(false);

        // AUTO REFRESH

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(data.detail || data.message || "Save failed");
      }
    } catch (err) {
      console.log("SAVE ERROR:", err);

      toast.error(err.message || "Server error");
    }
  };
  return (
    <TeacherAuthGuard>
      <main
        className="
      space-y-8
      font-[Inter]
      "
      >
        <div
          className="
        rounded-[36px]
        bg-white/75
        backdrop-blur-3xl
        border
        border-white/60
        shadow-lg
        p-8
        transition-all
                duration-300
                hover:bg-violet-50
                hover:border-violet-300
                hover:shadow-lg
                hover:-translate-y-1
        "
        >
          <h1
            className="
          text-[42px]
          font-extrabold
          tracking-tight
          text-slate-900
          "
          >
            Take Attendance
          </h1>

          <p
            className="
          mt-2
          text-slate-600
          font-medium
          "
          >
            AI Face Recognition Attendance
          </p>
        </div>

        <div
          className="
        grid
        lg:grid-cols-3
        gap-6
        "
        >
          <Card
            title="Present"
            value={recognized.length}
            icon={<CheckCircle2 />}
          />

          <Card title="Photos" value={photos.length} icon={<Users />} />

          <Card
            title="Camera"
            value={cameraOn ? "ON" : "OFF"}
            icon={<Camera />}
          />
        </div>

        <div
          className="
        grid
        lg:grid-cols-2
        gap-6
        "
        >
          <div
            className="
          rounded-[36px]
          bg-white/75
          backdrop-blur-3xl
          border
          border-white/60
          shadow-lg
          p-7
          transition-all
                duration-300
                hover:bg-violet-50
                hover:border-violet-300
                hover:shadow-lg
                hover:-translate-y-1
          "
          >
            <h2
              className="
            text-2xl
            font-bold
            text-slate-900
            "
            >
              Attendance Setup
            </h2>

            <select
              value={subject}
              onChange={(e) => setSubject(Number(e.target.value))}
              className="
            mt-5
            w-full
            h-14
            rounded-2xl
            border
            border-slate-200
            px-4
            bg-white
            text-slate-700
            font-medium
            outline-none
            transition-all
                duration-300
                hover:bg-violet-50
                hover:border-violet-300
                hover:shadow-lg
            "
            >
              <option value="">Select Subject</option>

              {subjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.name}
                  {" - "}
                  {s.section}
                </option>
              ))}
            </select>

            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={uploadPhotos}
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="
            mt-5
            w-full
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition-all
                duration-300
                hover:bg-violet-500
                hover:border-violet-500
                hover:shadow-lg
            "
            >
              <Upload size={18} />
              Upload Photos
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className="
            mt-4
            w-full
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-purple-500
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition-all
                duration-300
                hover:bg-violet-500
                hover:border-violet-500
                hover:shadow-lg
            "
            >
              <Play size={18} />
              {cameraOn ? "Stop Camera" : "Start Camera"}
            </button>
            {cameraOn && (
              <button
                onClick={capturePhoto}
                className="
              mt-4
              w-full
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-emerald-500
              to-green-600
              text-white
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition-all
                duration-300
                hover:bg-violet-500
                hover:border-violet-500
                hover:shadow-lg
              "
              >
                <Camera size={18} />
                Capture Photo
              </button>
            )}

            <button
              onClick={runAnalysis}
              className="
            mt-4
            w-full
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-pink-600
            to-rose-500
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition-all
                duration-300
                hover:bg-violet-500
                hover:border-violet-300
                hover:shadow-lg
            "
            >
              <ScanFace size={18} />
              {loading ? "Analyzing..." : "Run Face Analysis"}
            </button>
          </div>

          <div
            className="
          rounded-[36px]
          bg-white/75
          backdrop-blur-3xl
          border
          border-white/60
          shadow-lg
          p-7
          transition-all
                duration-300
                hover:bg-violet-50
                hover:border-violet-300
                hover:shadow-lg
                hover:-translate-y-1
          "
          >
            <h2
              className="
            text-2xl
            font-bold
            text-slate-900
            mb-4
            "
            >
              Live Camera
            </h2>

            <div
              className="
            h-[340px]
            rounded-3xl
            overflow-hidden
            bg-slate-900
            transition-all
              
            "
            >
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="
                w-full
                h-full
                object-cover
                "
                />
              ) : (
                <div
                  className="
                h-full
                flex
                items-center
                justify-center
                text-slate-200
                text-xl
                font-semibold
                "
                >
                  Camera Off
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PHOTO GALLERY */}

        <div
          className="
        rounded-[36px]
        bg-white/75
        backdrop-blur-3xl
        border
        p-7
        transition-all
                duration-300
                hover:bg-violet-50
                hover:border-violet-300
                hover:shadow-lg
                hover:-translate-y-3
        "
        >
          <h2
            className="
          text-2xl
          font-bold
          text-slate-900
          mb-5
          "
          >
            Added Photos
          </h2>

          <div
            className="
          grid
          md:grid-cols-4
          gap-4
          "
          >
            {photos.map((img, i) => (
              <div
                key={i}
                className="
                relative
                rounded-3xl
                overflow-hidden
                "
              >
                <img
                  src={img.url}
                  className="
                  h-40
                  w-full
                  object-cover
                  "
                />

                <button
                  onClick={() => removePhoto(i)}
                  className="
                  absolute
                  top-2
                  right-2
                  bg-red-500
                  text-white
                  rounded-full
                  p-2
                  "
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ATTENDANCE REVIEW */}

        {attendanceTable.length > 0 && (
          <div
            className="
          rounded-[36px]
          bg-white/75
          backdrop-blur-3xl
          border
          p-7
          "
          >
            <div
              className="
            flex
            justify-between
            items-center
            mb-5
            "
            >
              <h2
                className="
              text-2xl
              font-bold
              text-slate-900
              "
              >
                Attendance Review
              </h2>

              <p
                className="
              text-slate-500
              font-medium
              "
              >
                Review before saving
              </p>
            </div>

            <div
              className="
            overflow-hidden
            rounded-3xl
            border
            "
            >
              <table
                className="
              w-full
              text-left
              "
              >
                <thead
                  className="
                bg-slate-900
                text-white
                "
                >
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">ID</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendanceTable.map((row, i) => (
                    <tr
                      key={i}
                      className="
                    border-b
                    bg-white
                    text-slate-800
                    font-medium
                    "
                    >
                      <td
                        className="
                      p-4
                      text-slate-900
                      font-semibold
                      "
                      >
                        {row.name}
                      </td>

                      <td
                        className="
                      p-4
                      text-slate-800
                      font-medium
                      "
                      >
                        {row.student_id}
                      </td>

                      <td
                        className="
                      p-4
                      text-slate-700
                      font-medium
                      "
                      >
                        {row.source}
                      </td>

                      <td className="p-4">
                        {row.status === "Present" ? (
                          <span
                            className="
                          text-green-600
                          font-bold
                          "
                          >
                            ✅ Present
                          </span>
                        ) : (
                          <span
                            className="
                          text-red-500
                          font-bold
                          "
                          >
                            ❌ Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="
            mt-6
            grid
            md:grid-cols-2
            gap-4
            "
            >
              <button
                onClick={() => {
                  setAttendanceTable([]);
                  setRecognized([]);
                  setPresentCount(0);
                }}
                className="
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-pink-500
              to-rose-500
              text-white
              font-semibold
              "
              >
                Discard
              </button>

              <button
                onClick={saveAttendance}
                className="
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-500
              text-white
              font-semibold
              "
              >
                Confirm & Save
              </button>
            </div>
          </div>
        )}
      </main>
    </TeacherAuthGuard>
  );
}
