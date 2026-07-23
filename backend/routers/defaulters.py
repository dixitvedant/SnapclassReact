from fastapi import APIRouter
from database.db import supabase
from collections import defaultdict
from fastapi import Depends
from services.teacher_auth import verify_teacher_token

router = APIRouter(
    prefix="/defaulters",
    tags=["Defaulters"]
)

@router.get("/teacher")
def get_defaulters(

    user=Depends(
        verify_teacher_token
    )

):
    teacher_id = user["teacher_id"]

    subjects = (
        supabase
        .table("subject")
        .select("*")
        .eq(
            "teacher_id",
            teacher_id
        )
        .execute()
    )

    subject_ids = [

        s["subject_id"]

        for s in subjects.data
    ]

    if not subject_ids:

        return {

            "success": True,

            "students": []

        }

    logs = (

        supabase
        .table("attendence_logs")
        .select(
            """
            *,
            students(
                student_id,
                name,
                student_email,
                parent_email
            ),
            attendence_sessions(
                subject(
                    name,
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

    student_map = defaultdict(

        lambda: {

            "student_id": 0,
            "student_name": "",
            "student_email": "",
            "parent_email": "",
            "present": 0,
            "absent": 0,
            "total": 0

        }

    )

    for log in logs.data:

        sid = log["student_id"]

        item = student_map[sid]

        item["student_id"] = sid

        item["student_name"] = (
            log["students"]["name"]
        )

        item["student_email"] = (
            log["students"].get(
                "student_email",
                ""
            )
        )

        item["parent_email"] = (
            log["students"].get(
                "parent_email",
                ""
            )
        )

        item["total"] += 1

        if log["is_present"]:

            item["present"] += 1

        else:

            item["absent"] += 1

    result = []

    for item in student_map.values():

        attendance = round(

            (
                item["present"]
                /
                item["total"]
            )
            * 100,

            1

        )

        if attendance < 75:

            result.append({

                **item,

                "attendance":
                    attendance

            })

    result.sort(

        key=lambda x:
        x["attendance"]

    )

    return {

        "success": True,

        "students": result

    }