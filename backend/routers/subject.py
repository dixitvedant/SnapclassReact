from fastapi import APIRouter
from pydantic import BaseModel
from database.db import supabase
from fastapi import Depends
from services.teacher_auth import (
    verify_teacher_token
)

router = APIRouter(
    prefix="/subject",
    tags=["Subject"]
)


# =====================================
# MODELS
# =====================================

class SubjectCreate(BaseModel):

    name: str
    subject_code: str
    section: str


class SubjectUpdate(BaseModel):

    name: str
    subject_code: str
    section: str


# =====================================
# GET TEACHER SUBJECTS
# =====================================

@router.get("/teacher")
async def get_teacher_subjects(

    user=Depends(
        verify_teacher_token
    )

):

    teacher_id = user["teacher_id"]

    response = (

        supabase
        .table("subject")
        .select("*")
        .eq(
            "teacher_id",
            teacher_id
        )
        .execute()

    )

    return {

        "success": True,

        "subjects": response.data
    }


# =====================================
# CREATE SUBJECT
# =====================================

@router.post("/create")
async def create_subject(

    data: SubjectCreate,

    user=Depends(
        verify_teacher_token
    )

):
    teacher_id = user["teacher_id"]

    existing = (

        supabase
        .table(
            "subject"
        )
        .select("*")
        .eq(
            "subject_code",
            data.subject_code
        )
        .execute()
    )

    if existing.data:

        return {

            "success": False,

            "message":
            "Subject code already exists"
        }

    result = (

        supabase
        .table(
            "subject"
        )
        .insert({

            "teacher_id":
            teacher_id,

            "name":
            data.name,

            "subject_code":
            data.subject_code,

            "section":
            data.section

        })
        .execute()

    )

    return {

        "success": True,

        "subject":
        result.data[0]
    }


# =====================================
# UPDATE SUBJECT
# =====================================

@router.put(
    "/update/{subject_id}"
)
async def update_subject(

    subject_id: int,

    data: SubjectUpdate,

    user=Depends(
        verify_teacher_token
    )

    ):
    subject = (

        supabase
        .table("subject")
        .select("*")
        .eq(
            "subject_id",
            subject_id
        )
        .single()
        .execute()

    )

    if not subject.data:

        return {

            "success": False,

            "message":
            "Subject not found"
        }

    if subject.data["teacher_id"] != user["teacher_id"]:

        return {

            "success": False,

            "message":
            "Unauthorized"
        }

    result = (

        supabase
        .table(
            "subject"
        )
        .update({

            "name":
            data.name,

            "subject_code":
            data.subject_code,

            "section":
            data.section

        })
        .eq(
            "subject_id",
            subject_id
        )
        .execute()

    )

    return {

        "success": True,

        "subject":
        result.data
    }


# =====================================
# DELETE SUBJECT
# =====================================

@router.delete(
    "/delete/{subject_id}"
)
async def delete_subject(

    subject_id: int,

    user=Depends(
        verify_teacher_token
    )

):
    subject = (

        supabase
        .table("subject")
        .select("*")
        .eq(
            "subject_id",
            subject_id
        )
        .single()
        .execute()

    )

    if not subject.data:

        return {

            "success": False,

            "message":
            "Subject not found"
        }

    if subject.data["teacher_id"] != user["teacher_id"]:

        return {

            "success": False,

            "message":
            "Unauthorized"
        }

    # remove enrollments first

    supabase.table(
        "subject_students"
    ).delete().eq(
        "subject_id",
        subject_id
    ).execute()

    result = (

        supabase
        .table(
            "subject"
        )
        .delete()
        .eq(
            "subject_id",
            subject_id
        )
        .execute()

    )

    return {

        "success": True
    }


# =====================================
# VIEW ENROLLED STUDENTS
# =====================================

@router.get(
    "/students/{subject_id}"
)
async def get_subject_students(

    subject_id: int,

    user=Depends(
        verify_teacher_token
    )

):
    subject = (

        supabase
        .table("subject")
        .select("*")
        .eq(
            "subject_id",
            subject_id
        )
        .single()
        .execute()

    )

    if not subject.data:

        return {

            "success": False,

            "message":
            "Subject not found"

        }

    if subject.data["teacher_id"] != user["teacher_id"]:

        return {

            "success": False,

            "message":
            "Unauthorized"

        }

    result = (

        supabase
        .table(
            "subject_students"
        )
        .select(
            "*, students(*)"
        )
        .eq(
            "subject_id",
            subject_id
        )
        .execute()

    )

    return {

        "success": True,

        "students":
        result.data
    }

# =====================================
# ENROLL SUBJECT
# =====================================

class SubjectEnroll(
    BaseModel
):
    student_id: int
    subject_code: str


@router.post(
    "/enroll"
)
async def enroll_subject(
    data: SubjectEnroll
):

    # find subject

    subject = (

        supabase
        .table(
            "subject"
        )
        .select("*")
        .eq(
            "subject_code",
            data.subject_code
        )
        .execute()

    )

    if not subject.data:

        return {

            "success": False,

            "message":
            "Invalid Subject Code"
        }

    subject_id = (
        subject
        .data[0]
        [
            "subject_id"
        ]
    )

    # already enrolled check

    existing = (

        supabase
        .table(
            "subject_students"
        )
        .select("*")
        .eq(
            "subject_id",
            subject_id
        )
        .eq(
            "student_id",
            data.student_id
        )
        .execute()

    )

    if existing.data:

        return {

            "success": False,

            "message":
            "Already Enrolled"
        }

    # enroll

    (

        supabase
        .table(
            "subject_students"
        )
        .insert({

            "subject_id":
            subject_id,

            "student_id":
            data.student_id

        })
        .execute()

    )

    return {

        "success": True,

        "subject":
        subject.data[0]
    }