from fastapi import APIRouter, HTTPException
from database.db import supabase
from fastapi import Depends

from services.auth_guard import (
    verify_student_token
)

router = APIRouter(
    prefix="/student-notifications",
    tags=["Student Notifications"]
)

@router.get("/{student_id}")
def get_notifications(
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
        result = (
            supabase
            .table("notifications")
            .select("*")
            .eq("student_id", student_id)
            .order(
                "notification_id",
                desc=True
            )
            .execute()
        )

        return {
            "success": True,
            "notifications": result.data
        }

    except Exception as e:

        print("Notification Error:", e)

        return {
            "success": False,
            "message": str(e)
        }