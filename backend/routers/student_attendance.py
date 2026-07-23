from fastapi import APIRouter,Depends
from services.auth_guard import verify_student_token
from database.db import supabase
from fastapi import HTTPException

router = APIRouter(
    prefix="/student-attendance",
    tags=["Student Attendance"]
)

@router.get("/{student_id}")
def get_student_attendance(
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
    
    result = (
        supabase
        .table("attendence_logs")
        .select("""
            id,
            subject_id,
            timestamp,
            is_present,
            subject(
                name,
                subject_code
            )
        """)
        .eq("student_id", student_id)
        .order("timestamp", desc=True)
        .execute()
    )

    logs = result.data

    present_count = sum(
        1 for row in logs
        if row["is_present"]
    )

    absent_count = sum(
        1 for row in logs
        if not row["is_present"]
    )

    total = len(logs)

    attendance_percent = (
        round(
            (present_count / total) * 100,
            2
        )
        if total > 0
        else 0
    )

    return {
        "success": True,
        "attendance": logs,
        "present": present_count,
        "absent": absent_count,
        "total": total,
        "percentage": attendance_percent
    }