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
    prefix="/teacher-forgot",
    tags=["Teacher Forgot Password"]
)

# ====================================
# OTP STORE
# ====================================

otp_store = {}

# ====================================
# SEND MAIL
# ====================================

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

        print(
            "MAIL ERROR:",
            e
        )

        return False

# ====================================
# SEND OTP
# ====================================

@router.post(
    "/send-otp"
)
def send_otp(
    payload: dict
):

    email = payload.get(
        "email"
    )

    if not email:

        return {

            "success": False,

            "message":
                "Email required"

        }

    teacher = (
        supabase
        .table(
            "teachers"
        )
        .select(
            "*"
        )
        .eq(
            "email",
            email
        )
        .execute()
    )

    if not teacher.data:

        return {

            "success": False,

            "message":
                "Email not found"

        }

    otp = str(

        random.randint(
            100000,
            999999
        )

    )

    otp_store[email] = {

    "otp":
        otp,

    "expires":
        datetime.now()
        +
        timedelta(
            minutes=5
        ),

    "verified":
        False
}

    body = f"""

    <html>

    <body>

        <h2>
            SmartAttend OTP
        </h2>

        <p>
            Your OTP is:
        </p>

        <h1>
            {otp}
        </h1>

        <p>
            Valid for 5 minutes.
        </p>

    </body>

    </html>

    """

    send_email(

        email,

        "Password Reset OTP",

        body

    )

    return {

        "success": True,

        "message":
            "OTP Sent"

    }

# ====================================
# VERIFY OTP
# ====================================

@router.post(
    "/verify-otp"
)
def verify_otp(
    payload: dict
):

    email = payload.get(
        "email"
    )

    otp = payload.get(
        "otp"
    )

    if email not in otp_store:

        return {

            "success": False,

            "message":
                "OTP not found"

        }

    saved = otp_store[
        email
    ]

    if (
        datetime.now()
        >
        saved["expires"]
    ):

        del otp_store[
            email
        ]

        return {

            "success": False,

            "message":
                "OTP expired"

        }

    if otp != saved["otp"]:

        return {

            "success": False,

            "message":
                "Invalid OTP"

        }

    # OTP Verified
    saved["verified"] = True

    return {

        "success": True,

        "message":
            "OTP Verified"

    }

# ====================================
# RESET PASSWORD
# ====================================

@router.post(
    "/reset-password"
)
def reset_password(
    payload: dict
):

    email = payload.get(
        "email"
    )

    new_password = payload.get(
        "new_password"
    )

    record = otp_store.get(email)

    if not record:

        return {

            "success": False,

            "message":
                "OTP not requested"

        }

    if datetime.now() > record["expires"]:

        del otp_store[email]

        return {

            "success": False,

            "message":
                "OTP expired"

        }

    if not record.get("verified"):

        return {

            "success": False,

            "message":
                "Verify OTP first"

        }

    hashed_password = bcrypt.hashpw(

        new_password.encode(
            "utf-8"
        ),

        bcrypt.gensalt()

    ).decode(
        "utf-8"
    )

    (
        supabase
        .table(
            "teachers"
        )
        .update({

            "password":
                hashed_password

        })
        .eq(
            "email",
            email
        )
        .execute()
    )

    del otp_store[
        email
    ]

    return {

        "success": True,

        "message":
            "Password Reset Successful"

    }