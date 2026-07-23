"use client";

import {
  GraduationCap,
  UserRound,
  Clock3,
} from "lucide-react";

const registrations = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Student",
    time: "10 mins ago",
    color: "bg-emerald-100",
    icon: GraduationCap,
  },
  {
    id: 2,
    name: "Priya Verma",
    role: "Teacher",
    time: "25 mins ago",
    color: "bg-sky-100",
    icon: UserRound,
  }
];

export default function RecentRegistrations() {
  return (
    <div
      className="
      h-full
      rounded-[30px]
      bg-white/75
      backdrop-blur-xl
      border
      border-white
      shadow-lg
      p-7
      flex
      flex-col
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h2
            className="
            text-2xl
            font-black
            text-slate-900
            "
          >
            Recent Registrations
          </h2>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
            "
          >
            Latest teachers and students
          </p>

        </div>

      </div>

      {/* List */}

      <div
        className="
        mt-8
        space-y-5
        flex-1
        "
      >

        {registrations.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.id}
              className="
              flex
              items-center
              justify-between
              rounded-2xl
              p-4
              hover:bg-slate-50
              transition
              "
            >

              <div
                className="
                flex
                items-center
                gap-4
                "
              >

                <div
                  className={`
                  h-14
                  w-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  ${item.color}
                  `}
                >
                  <Icon
                    size={28}
                    className="text-slate-700"
                  />
                </div>

                <div>

                  <h3
                    className="
                    font-bold
                    text-slate-900
                    "
                  >
                    {item.name}
                  </h3>

                  <p
                    className="
                    text-sm
                    text-slate-500
                    "
                  >
                    {item.role}
                  </p>

                </div>

              </div>

              <div
                className="
                flex
                items-center
                gap-2
                text-sm
                text-slate-400
                "
              >

                <Clock3 size={16} />

                {item.time}

              </div>

            </div>

          );

        })}

      </div>

      {/* Footer */}

      <button
        className="
        mt-6
        h-12
        rounded-2xl
        bg-emerald-50
        text-emerald-700
        font-semibold
        hover:bg-emerald-100
        transition
        "
      >
        View All Registrations
      </button>

    </div>
  );
}