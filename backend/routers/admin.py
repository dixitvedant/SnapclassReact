from fastapi import APIRouter
from pydantic import BaseModel

from database.db import supabase
from services.jwt_service import create_access_token
import bcrypt

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# ==========================================
# ADMIN REGISTER MODEL
# ==========================================

class AdminRegister(BaseModel):

    name: str

    username: str

    email: str

    password: str

# ==========================================
# ADMIN LOGIN MODEL
# ==========================================

class AdminLogin(BaseModel):

    username: str

    password: str

# ==========================================
# ADMIN REGISTER
# ==========================================

@router.post("/register")
def register_admin(data: AdminRegister):

    # ======================================
    # CHECK USERNAME
    # ======================================

    username_exists = (
        supabase
        .table("admin")
        .select("admin_id")
        .eq(
            "username",
            data.username
        )
        .execute()
    )

    if username_exists.data:

        return {

            "success": False,

            "message":
                "Username already exists"

        }

    # ======================================
    # CHECK EMAIL
    # ======================================

    email_exists = (
        supabase
        .table("admin")
        .select("admin_id")
        .eq(
            "email",
            data.email
        )
        .execute()
    )

    if email_exists.data:

        return {

            "success": False,

            "message":
                "Email already exists"

        }

    # ======================================
    # HASH PASSWORD
    # ======================================

    hashed_password = bcrypt.hashpw(

        data.password.encode("utf-8"),

        bcrypt.gensalt()

    ).decode("utf-8")

    # ======================================
    # INSERT ADMIN
    # ======================================

    result = (

        supabase

        .table("admin")

        .insert({

            "name":
                data.name,

            "username":
                data.username,

            "email":
                data.email,

            "password_hash":
                hashed_password

        })

        .execute()

    )

    return {

        "success": True,

        "message":
            "Admin Registered Successfully",

        "admin": {

        "admin_id": result.data[0]["admin_id"],

        "name": result.data[0]["name"],

        "username": result.data[0]["username"],

        "email": result.data[0]["email"]

    }

    }

# ==========================================
# ADMIN LOGIN
# ==========================================

@router.post("/login")
def login(data: AdminLogin):

    result = (

        supabase

        .table("admin")

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
                "Invalid Username"

        }

    admin = result.data[0]

    password_ok = bcrypt.checkpw(

        data.password.encode(),

        admin["password_hash"].encode()

    )

    if not password_ok:

        return {

            "success": False,

            "message":
                "Invalid Password"

        }

    token = create_access_token({

        "admin_id":
            admin["admin_id"],

        "role":
            "admin"

    })

    return {

    "success": True,

    "token": token,

    "admin": {

        "admin_id": admin["admin_id"],

        "name": admin["name"],

        "username": admin["username"],

        "email": admin["email"]

    }

}