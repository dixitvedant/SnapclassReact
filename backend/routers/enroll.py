from fastapi import APIRouter, Depends
from pydantic import BaseModel

from database.db import supabase

from services.auth_guard import (
    verify_student_token
)

router = APIRouter(
    prefix="/enroll",
    tags=["Enrollment"]
)


class EnrollCode(BaseModel):

    subject_code: str


@router.post("/code")
def enroll_subject(

    data: EnrollCode,

    user=Depends(
        verify_student_token
    )

):

    student_id = user["student_id"]

    # ======================
    # FIND SUBJECT
    # ======================

    subject_result = (
        supabase
        .table("subject")
        .select("*")
        .eq(
            "subject_code",
            data.subject_code
        )
        .execute()
    )

    if not subject_result.data:

        return {
            "success": False,
            "message": "Invalid Subject Code"
        }

    subject = subject_result.data[0]

    # ======================
    # ALREADY ENROLLED ?
    # ======================

    existing = (
        supabase
        .table("subject_students")
        .select("*")
        .eq(
            "student_id",
            student_id
        )
        .eq(
            "subject_id",
            subject["subject_id"]
        )
        .execute()
    )

    if existing.data:

        return {
            "success": False,
            "message": "Already enrolled"
        }

    # ======================
    # INSERT
    # ======================

    (
        supabase
        .table("subject_students")
        .insert({

            "student_id":
                student_id,

            "subject_id":
                subject["subject_id"]

        })
        .execute()
    )

    return {

        "success": True,

        "message":
            "Enrollment successful"
    }