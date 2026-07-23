from fastapi import APIRouter, Body, HTTPException
from database.db import supabase
from fastapi import Depends

from services.auth_guard import (
    verify_student_token
)

router = APIRouter(
    prefix="/student-profile",
    tags=["Student Profile"]
)

# =====================================
# GET STUDENT PROFILE
# =====================================

@router.get("/{student_id}")
def get_profile(
    student_id: int,
    user=Depends(
        verify_student_token
    )
):
    if student_id != user["student_id"]:

        return {
            "success": False,
            "message": "Unauthorized"
        }    

    result = (
        supabase
        .table("students")
        .select("*")
        .eq("student_id", student_id)
        .single()
        .execute()
    )

    return {
        "success": True,
        "student": result.data
    }


# =====================================
# UPDATE STUDENT PROFILE
# =====================================

@router.put("/update/{student_id}")
def update_profile(

    student_id: int,

    data: dict = Body(...),

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

        (
            supabase
            .table("students")
            .update({
                "student_email":
                    data.get("student_email"),

                "parent_email":
                    data.get("parent_email"),

                "parent_mobile":
                    data.get("parent_mobile")
            })
            .eq(
                "student_id",
                student_id
            )
            .execute()
        )

        return {
            "success": True,
            "message":
                "Profile Updated Successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }