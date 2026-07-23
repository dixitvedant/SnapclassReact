from fastapi import APIRouter
from database.db import supabase
from fastapi import Depends
from services.teacher_auth import verify_teacher_token
from collections import defaultdict

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance Records"]
)


@router.get("/teacher")
def get_teacher_attendance(

    user=Depends(
        verify_teacher_token
    ),

    limit: int = 10

):

    teacher_id = user["teacher_id"]

    # =========================
    # SUBJECTS
    # =========================

    subjects_res = (

        supabase
        .table(
            "subject"
        )
        .select(
            "*"
        )
        .eq(
            "teacher_id",
            teacher_id
        )
        .execute()

    )

    subjects = subjects_res.data

    subject_ids = [

        s["subject_id"]
        for s in subjects
    ]

    if not subject_ids:

        return {

            "success": True,

            "dashboard": {

                "students": 0,
                "classes": 0,
                "average": 0,
                "below75": 0,
                "present": 0,
                "absent": 0
            },

            "records": [],
            "class_summary": [],
            "student_summary": []
        }

    # =========================
    # ATTENDANCE LOGS
    # =========================

    logs_res = (

        supabase
        .table(
            "attendence_logs"
        )
        .select(
            """
            id,
            timestamp,
            student_id,
            subject_id,
            is_present,
            session_id,
            students(
                student_id,
                name
            ),
            attendence_sessions(
                session_id,
                lecture_time,
                lecture_status,
                subject(
                    subject_id,
                    name,
                    section,
                    subject_code
                )
            )
            """
        )
        .in_(
            "subject_id",
            subject_ids
        )
        .execute()

    )

    logs = logs_res.data

    # =========================
    # DASHBOARD
    # =========================

    students = set()

    session_ids = set()

    total_present = 0

    for log in logs:

        students.add(
            log["student_id"]
        )

        session_ids.add(
            log["session_id"]
        )

        if log.get(
            "is_present"
        ):
            total_present += 1

    total_logs = len(
        logs
    )

    total_absent = (
        total_logs
        -
        total_present
    )

    average = 0

    if total_logs > 0:

        average = round(

            (
                total_present
                /
                total_logs
            )
            * 100,

            1
        )

    # =========================
    # STUDENT SUMMARY
    # =========================

    student_map = defaultdict(

        lambda: {

            "student_name": "",
            "total": 0,
            "present": 0,
            "absent": 0
        }

    )

    for log in logs:

        sid = log[
            "student_id"
        ]

        name = log[
            "students"
        ][
            "name"
        ]

        student_map[sid][
            "student_name"
        ] = name

        student_map[sid][
            "total"
        ] += 1

        if log.get(
            "is_present"
        ):

            student_map[sid][
                "present"
            ] += 1

        else:

            student_map[sid][
                "absent"
            ] += 1

    student_summary = []

    below75 = 0

    for sid, item in student_map.items():

        percent = 0

        if item[
            "total"
        ] > 0:

            percent = round(

                (
                    item[
                        "present"
                    ]
                    /
                    item[
                        "total"
                    ]
                ) * 100,

                1
            )

        if percent < 75:
            below75 += 1

        student_summary.append({

            "student_id":
                sid,

            "student_name":
                item[
                    "student_name"
                ],

            "total_classes":
                item[
                    "total"
                ],

            "present":
                item[
                    "present"
                ],

            "absent":
                item[
                    "absent"
                ],

            "attendance":
                percent
        })

    # =========================
    # CLASS SUMMARY
    # =========================

    class_map = defaultdict(

    lambda: {

        "subject": "",
        "subject_code": "",
        "lecture_time": "",
        "present": 0,
        "total": 0
    }

)

    for log in logs:

        session_id = log[
            "session_id"
        ]

        subject = log[
            "attendence_sessions"
        ][
            "subject"
        ]

        class_map[
            session_id
        ][
            "subject"
        ] = subject[
            "name"
        ]

        class_map[
            session_id
        ][
            "subject_code"
        ] = subject[
            "subject_code"
        ]

        class_map[
            session_id
        ][
            "lecture_time"
        ] = log[
            "attendence_sessions"
        ][
            "lecture_time"
        ]

        class_map[
            session_id
        ][
            "total"
        ] += 1

        if log.get(
            "is_present"
        ):

            class_map[
                session_id
            ][
                "present"
            ] += 1

    class_summary = []

    for sid, item in class_map.items():

        class_summary.append({

            "session_id":
                sid,

            "lecture_time":
                item[
                    "lecture_time"
                ],

            "subject":
                item[
                    "subject"
                ],

            "subject_code":
                item[
                    "subject_code"
                ],

            "present":
                item[
                    "present"
                ],

            "total":
                item[
                    "total"
                ]
        })
    # =========================
    # RESPONSE
    # =========================

    return {

        "success": True,

        "dashboard": {

            "students":
                len(
                    students
                ),

            "classes":
                len(
                    session_ids
                ),
            
            "subjects":
            len(subject_ids),

            "average":
                average,

            "below75":
                below75,

            "present":
                total_present,

            "absent":
                total_absent
        },

        "records":
            logs,

        "class_summary":
            class_summary,

        "student_summary":
            student_summary
    }