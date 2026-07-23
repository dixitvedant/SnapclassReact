from fastapi import APIRouter
from database.db import supabase
import bcrypt
from fastapi import Depends

from services.teacher_auth import (
    verify_teacher_token
)
router = APIRouter(
    prefix="/teacher-profile",
    tags=["Teacher Password"]
)


@router.put("/change-password")
def change_password(

    payload: dict,

    user=Depends(
        verify_teacher_token
    )

):
    teacher_id = user["teacher_id"]

    current_password = payload.get(
        "current_password",
        ""
    )

    new_password = payload.get(
        "new_password",
        ""
    )

    # ==========================
    # GET TEACHER
    # ==========================

    teacher = (
        supabase
        .table("teachers")
        .select("*")
        .eq(
            "teacher_id",
            teacher_id
        )
        .single()
        .execute()
    )

    if not teacher.data:

        return {
            "success": False,
            "message": "Teacher not found"
        }

    # ==========================
    # VERIFY CURRENT PASSWORD
    # ==========================

    stored_hash = teacher.data["password"]

    if not bcrypt.checkpw(

        current_password.encode("utf-8"),

        stored_hash.encode("utf-8")

    ):

        return {

            "success": False,

            "message":
                "Current password incorrect"

        }

    # ==========================
    # HASH NEW PASSWORD
    # ==========================

    hashed_password = bcrypt.hashpw(

        new_password.encode("utf-8"),

        bcrypt.gensalt()

    ).decode("utf-8")

    # ==========================
    # UPDATE PASSWORD
    # ==========================

    (
        supabase
        .table("teachers")
        .update({

            "password":
                hashed_password

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
            "Password updated"

    }