from fastapi import APIRouter,Depends, HTTPException
from database.db import supabase
from services.auth_guard import verify_student_token
router = APIRouter(
    prefix="/student-subject",
    tags=["Student Subject"]
)


@router.get("/{student_id}/{subject_id}")
def get_subject_details(
    student_id: int,
    subject_id: int,
    user=Depends(
        verify_student_token
    )
):
    if user["student_id"] != student_id:

        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )
    # Subject Details

    subject_result = (
        supabase
        .table("subject")
        .select("*")
        .eq("subject_id", subject_id)
        .single()
        .execute()
    )

    # Attendance Records

    attendance_result = (
        supabase
        .table("attendence_logs")
        .select("""
            id,
            timestamp,
            is_present
        """)
        .eq("student_id", student_id)
        .eq("subject_id", subject_id)
        .order("timestamp", desc=True)
        .execute()
    )

    logs = attendance_result.data

    present = sum(
        1 for row in logs
        if row["is_present"]
    )

    absent = sum(
        1 for row in logs
        if not row["is_present"]
    )

    total = len(logs)

    percentage = (
        round(
            (present / total) * 100,
            2
        )
        if total > 0
        else 0
    )

    return {
        "success": True,
        "subject": subject_result.data,
        "present": present,
        "absent": absent,
        "total": total,
        "percentage": percentage,
        "attendance": logs
    }