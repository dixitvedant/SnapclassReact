from fastapi import APIRouter, Depends
from pydantic import BaseModel

from database.db import supabase

from services.auth_guard import (
    verify_student_token
)

router = APIRouter(
    prefix="/unenroll",
    tags=["Unenroll"]
)


class UnenrollModel(BaseModel):
    subject_id: int


@router.post("/")
def unenroll_subject(

    data: UnenrollModel,

    user=Depends(
        verify_student_token
    )

):

    student_id = user["student_id"]

    result = (
        supabase
        .table("subject_students")
        .delete()
        .eq(
            "student_id",
            student_id
        )
        .eq(
            "subject_id",
            data.subject_id
        )
        .execute()
    )

    return {
        "success": True,
        "message": "Subject removed"
    }