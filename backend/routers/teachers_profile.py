from fastapi import APIRouter
from pydantic import BaseModel
from fastapi import Depends
from services.teacher_auth import (
    verify_teacher_token
)

from database.db import supabase

router = APIRouter(
    prefix="/teacher-profile",
    tags=["Teacher Profile"]
)

# ===========================
# GET PROFILE
# ===========================

@router.get("/")
def get_profile(

    user=Depends(
        verify_teacher_token
    )

):
    teacher_id = user["teacher_id"]

    teacher = (

        supabase
        .table(
            "teachers"
        )
        .select("*")
        .eq(
            "teacher_id",
            teacher_id
        )
        .single()
        .execute()

    )

    return {

        "success": True,

        "teacher":
            teacher.data

    }


# ===========================
# UPDATE PROFILE
# ===========================

class ProfileUpdate(
    BaseModel
):

    name: str

    email: str

    mobile: str = ""

    department: str = ""

    qualification: str = ""


@router.put("/")
def update_profile(

    data: ProfileUpdate,

    user=Depends(
        verify_teacher_token
    )

):
    teacher_id = user["teacher_id"]

    (

        supabase
        .table(
            "teachers"
        )
        .update({

            "name":
                data.name,

            "email":
                data.email,

            "mobile":
                data.mobile,

            "department":
                data.department,

            "qualification":
                data.qualification

        })
        .eq(
            "teacher_id",
            teacher_id
        )
        .execute()

    )

    return {

        "success": True,

        "message":
            "Profile Updated"

    }