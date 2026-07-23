from fastapi import APIRouter,Depends, HTTPException
from services.auth_guard import verify_student_token
from database.db import supabase

router = APIRouter(
    prefix="/student-calendar",
    tags=["Student Calendar"]
)

@router.get("/{student_id}")
def get_student_calendar(
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
            session_id,
            subject_id,
            timestamp,
            is_present,
            subject(
                name,
                subject_code
            )
        """)
        .eq("student_id", student_id)
        .order("timestamp")
        .execute()
    )

    return {
        "success": True,
        "calendar": result.data
    }