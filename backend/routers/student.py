from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

from database.db import supabase
from ai.face_engine import get_face_embeddings

import numpy as np
import cv2
import bcrypt
from fastapi import Depends, HTTPException
from services.auth_guard import verify_student_token

router = APIRouter(
    prefix="/student",
    tags=["Student"]
)


# =========================================================
# GET STUDENT
# =========================================================
@router.get("/{student_id}")
def get_student(

    student_id: int,

    user=Depends(
        verify_student_token
    )

):

    if student_id != user["student_id"]:

        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

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
# =========================================================
# REGISTER STUDENT
# =========================================================

@router.post("/register")
async def register_student(

    name: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),

    student_email: str = Form(...),
    parent_email: str = Form(...),
    parent_mobile: str = Form(...),

    image: UploadFile = File(...)

):

    # ==========================================
    # CHECK USERNAME EXISTS
    # ==========================================

    existing_user = (
        supabase
        .table("students")
        .select("student_id")
        .eq("username", username)
        .execute()
    )

    if existing_user.data:

        return {
            "success": False,
            "message": "Username already exists"
        }

    # ==========================================
    # PROCESS IMAGE
    # ==========================================

    contents = await image.read()

    npimg = np.frombuffer(
        contents,
        np.uint8
    )

    image_np = cv2.imdecode(
        npimg,
        cv2.IMREAD_COLOR
    )

    if image_np is None:

        return {
            "success": False,
            "message": "Invalid image"
        }

    rgb = cv2.cvtColor(
        image_np,
        cv2.COLOR_BGR2RGB
    )

    embeddings = get_face_embeddings(rgb)

    if len(embeddings) == 0:

        return {
            "success": False,
            "message": "No face detected"
        }

    embedding = embeddings[0].tolist()

    # ==========================================
    # HASH PASSWORD
    # ==========================================

    hashed_password = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()

    # ==========================================
    # INSERT STUDENT
    # ==========================================

    result = (
        supabase
        .table("students")
        .insert({

            "name": name,

            "username": username,

            "password_hash": hashed_password,

            "student_email": student_email,

            "parent_email": parent_email,

            "parent_mobile": parent_mobile,

            "face_embedding": embedding

        })
        .execute()
    )

    return {

        "success": True,

        "message": "Student registered successfully",

        "student": result.data[0]
    }