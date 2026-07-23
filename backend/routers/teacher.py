from fastapi import APIRouter
from pydantic import BaseModel
from database.db import supabase
import bcrypt
import jwt

from datetime import (
    datetime,
    timedelta
)


router = APIRouter(
    prefix="/teacher",
    tags=["Teacher"]
)

SECRET_KEY = "snapclas_secret_key"


# =====================================================
# MODELS
# =====================================================

class TeacherRegister(BaseModel):

    name: str
    email: str
    username: str
    password: str


class TeacherLogin(BaseModel):

    username: str
    password: str


# =====================================================
# REGISTER
# =====================================================

@router.post("/register")
def register_teacher(data: TeacherRegister):

    # Check existing username

    existing = (
        supabase
        .table("teachers")
        .select("*")
        .eq(
            "username",
            data.username
        )
        .execute()
    )

    if existing.data:

        return {
            "success": False,
            "message":
            "Username already exists"
        }

    # Hash Password

    hashed_password = (
        bcrypt.hashpw(
            data.password.encode(),
            bcrypt.gensalt()
        )
        .decode()
    )

    # Insert Teacher

    result = (
        supabase
        .table("teachers")
        .insert({

            "name":
                data.name,

            "email":
                data.email,

            "username":
                data.username,

            "password":
                hashed_password
        })
        .execute()
    )

    return {

        "success": True,

        "teacher":
            result.data[0]
    }


# =====================================================
# LOGIN
# =====================================================

@router.post("/login")
def teacher_login(data: TeacherLogin):

    result = (
        supabase
        .table("teachers")
        .select("*")
        .eq(
            "username",
            data.username
        )
        .execute()
    )

    if not result.data:

        return {
            "success": False,
            "message":
            "Invalid Username or Password"
        }

    teacher = result.data[0]

    valid = bcrypt.checkpw(
        data.password.encode(),
        teacher["password"].encode()
    )

    if not valid:

        return {
            "success": False,
            "message":
            "Invalid Username or Password"
        }
    
    token = jwt.encode(

    {

        "teacher_id":
            teacher["teacher_id"],

        "role":
            "teacher",

        "exp":
            datetime.utcnow()
            + timedelta(days=30)

    },

    SECRET_KEY,

    algorithm="HS256"
)
    return {

    "success": True,

    "teacher": {

        "teacher_id":
            teacher["teacher_id"],

        "name":
            teacher["name"]

    },

    "token":
        token
}
    

# =====================================================
# FORGOT PASSWORD
# =====================================================

class ForgotPassword(BaseModel):

    email: str


@router.post("/forgot-password")
def forgot_password(
    data: ForgotPassword
):

    result = (
        supabase
        .table("teachers")
        .select("*")
        .eq(
            "email",
            data.email
        )
        .execute()
    )

    if not result.data:

        return {
            "success": False,
            "message":
            "Email not found"
        }

    # Future:
    # Gmail reset link / OTP

    return {

        "success": True,

        "message":
        "Reset system will be connected with Gmail later"
    }