from fastapi import APIRouter
from pydantic import BaseModel

from database.db import supabase
from services.jwt_service import create_access_token
import bcrypt

router = APIRouter(
    prefix="/student-auth",
    tags=["Student Authentication"]
)


class LoginRequest(BaseModel):

    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest):

    result = (

        supabase
        .table("students")
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
            "message": "Invalid Username"
        }

    student = result.data[0]

    password_ok = bcrypt.checkpw(

        data.password.encode(),

        student["password_hash"].encode()

    )

    if not password_ok:

        return {
            "success": False,
            "message": "Invalid Password"
        }

    token = create_access_token({

        "student_id":
            student["student_id"],

        "role":
            "student"

    })

    return {

        "success": True,

        "token":
            token,

        "student_id":
            student["student_id"],

        "name":
            student["name"]

    }