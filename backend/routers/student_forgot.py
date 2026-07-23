from fastapi import APIRouter
from database.db import supabase

from dotenv import load_dotenv

import os
import random
import smtplib
import bcrypt

from datetime import (
    datetime,
    timedelta
)

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

EMAIL_ID = os.getenv(
    "EMAIL_ID"
)

EMAIL_PASSWORD = os.getenv(
    "EMAIL_PASSWORD"
)

router = APIRouter(

    prefix="/student-forgot",

    tags=["Student Forgot Password"]

)

def send_email(
    to_email,
    subject,
    body
):

    try:

        msg = MIMEMultipart()

        msg["From"] = (
            f"SmartAttend <{EMAIL_ID}>"
        )

        msg["To"] = to_email

        msg["Subject"] = subject

        msg.attach(
            MIMEText(
                body,
                "html"
            )
        )

        server = smtplib.SMTP(
            "smtp.gmail.com",
            587
        )

        server.starttls()

        server.login(
            EMAIL_ID,
            EMAIL_PASSWORD
        )

        server.sendmail(
            EMAIL_ID,
            to_email,
            msg.as_string()
        )

        server.quit()

        return True

    except Exception as e:

        print(e)

        return False
    

@router.post("/send-otp")
def send_otp(payload: dict):

    username = payload.get(
        "username"
    )

    student = (

        supabase

        .table("students")

        .select("*")

        .eq(
            "username",
            username
        )

        .single()

        .execute()

    )

    if not student.data:

        return {

            "success": False,

            "message":
                "Invalid Username"

        }

    student_data = student.data
    # ====================================
    # DELETE OLD OTP
    # ====================================

    supabase.table(
        "student_otp"
    ).delete().eq(
        "student_id",
        student_data["student_id"]
    ).execute()

    otp = str(

        random.randint(
            100000,
            999999
        )

    )

    expiry = (

        datetime.now()

        +

        timedelta(
            minutes=5
        )

    )

    supabase.table(
        "student_otp"
    ).insert({

        "student_id":
            student_data["student_id"],

        "otp_code":
            otp,

        "expires_at":
            expiry.isoformat()

    }).execute()

    body = f"""

    <h2>Password Reset OTP</h2>

    <h1>{otp}</h1>

    <p>
    Valid for 5 minutes
    </p>

    """

    send_email(

        student_data[
            "student_email"
        ],

        "Password Reset OTP",

        body

    )

    return {

        "success": True,

        "message":
            "OTP Sent"

    }

@router.post("/verify-otp")
def verify_otp(payload: dict):

    username = payload.get(
        "username"
    )

    otp = payload.get(
        "otp"
    )

    student = (

        supabase

        .table("students")

        .select("*")

        .eq(
            "username",
            username
        )

        .single()

        .execute()

    )

    if not student.data:

        return {

            "success": False

        }

    student_id = student.data["student_id"]

    result = (

        supabase

        .table("student_otp")

        .select("*")

        .eq(
            "student_id",
            student_id
        )

        .eq(
            "otp_code",
            otp
        )

        .order(
            "otp_id",
            desc=True
        )

        .limit(1)

        .execute()

    )

    if not result.data:

        return {

            "success": False,

            "message":
                "Invalid OTP"

        }

    record = result.data[0]

    if datetime.now() > datetime.fromisoformat(
        record["expires_at"]
    ):

        # ====================================
        # DELETE EXPIRED OTP
        # ====================================

        supabase.table(
            "student_otp"
        ).delete().eq(
            "otp_id",
            record["otp_id"]
        ).execute()

        return {

            "success": False,

            "message":
                "OTP Expired"

        }

    supabase.table(
        "student_otp"
    ).update({

        "is_verified":
            True

    }).eq(

        "otp_id",
        record["otp_id"]

    ).execute()

    return {

        "success": True,

        "message":
            "OTP Verified"

    }

@router.post("/reset-password")
def reset_password(
    payload: dict
):

    username = payload.get(
        "username"
    )

    new_password = payload.get(
        "new_password"
    )

    student = (

        supabase

        .table("students")

        .select("*")

        .eq(
            "username",
            username
        )

        .single()

        .execute()

    )

    if not student.data:

        return {

            "success": False

        }

    student_id = student.data["student_id"]

    otp = (

        supabase

        .table("student_otp")

        .select("*")

        .eq(
            "student_id",
            student_id
        )

        .eq(
            "is_verified",
            True
        )

        .order(
            "otp_id",
            desc=True
        )

        .limit(1)

        .execute()

    )

    if not otp.data:

        return {

            "success": False,

            "message":
                "Verify OTP First"

        }

    hashed_password = bcrypt.hashpw(

        new_password.encode(
            "utf-8"
        ),

        bcrypt.gensalt()

    ).decode(
        "utf-8"
    )

    supabase.table(
        "students"
    ).update({

        "password_hash":
            hashed_password

    }).eq(

        "student_id",
        student_id

    ).execute()
    # ====================================
    # DELETE VERIFIED OTP
    # ====================================

    supabase.table(
        "student_otp"
    ).delete().eq(
        "student_id",
        student_id
    ).execute()

    return {

        "success": True,

        "message":
            "Password Updated"

    }