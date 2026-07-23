from fastapi import APIRouter
from database.db import supabase
from fastapi import Depends
from fastapi import HTTPException


from services.auth_guard import (
    verify_student_token
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/{student_id}")
def get_dashboard(

    student_id: int,

    user=Depends(
        verify_student_token
    )

): 
    if user["student_id"] != student_id:

        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )
    try:

        student_result = (
            supabase
            .table("students")
            .select("*")
            .eq("student_id", student_id)
            .execute()
        )

        if not student_result.data:
            return {
                "success": False,
                "message": "Student not found"
            }

        student = student_result.data[0]

        subject_result = (
            supabase
            .table("subject_students")
            .select("*, subject(*)")
            .eq("student_id", student_id)
            .execute()
        )

        enrolled_subjects = subject_result.data

        attendance_result = (
            supabase
            .table("attendence_logs")
            .select("*")
            .eq("student_id", student_id)
            .execute()
        )

        logs = attendance_result.data

        total_classes = len(logs)

        attended_classes = len([
            log
            for log in logs
            if log.get("status") == "Present"
        ])

        attendance_percent = (
            round(
                attended_classes /
                total_classes * 100,
                1
            )
            if total_classes > 0
            else 0
        )

        return {
            "success": True,
            "dashboard": {
                "student_id": student["student_id"],
                "name": student["name"],
                "subjects": len(enrolled_subjects),
                "attendance": attendance_percent,
                "total_classes": total_classes,
                "attended_classes": attended_classes,
                "subjects_list": enrolled_subjects
            }
        }

    except Exception as e:

        print("Dashboard Error:", e)

        return {
            "success": False,
            "message": str(e)
        }