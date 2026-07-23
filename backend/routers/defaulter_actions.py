import os
import smtplib

from dotenv import load_dotenv

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import Depends
from services.teacher_auth import verify_teacher_token

load_dotenv()

EMAIL_ID = os.getenv(
    "EMAIL_ID"
)

EMAIL_PASSWORD = os.getenv(
    "EMAIL_PASSWORD"
)
from fastapi import APIRouter
from database.db import supabase

router = APIRouter(
    prefix="/defaulter-actions",
    tags=["Defaulter Actions"]
)
@router.post("/warn-student/{student_id}")
def warn_student(

    student_id: int,

    user=Depends(
        verify_teacher_token
    )

):

    student = (
        supabase
        .table("students")
        .select("*")
        .eq(
            "student_id",
            student_id
        )
        .single()
        .execute()
    )

    if not student.data:

        return {

            "success": False,

            "message":
                "Student not found"

        }
    student_email = (
    student.data.get(
        "student_email"
    )
)

    if student_email:

        send_email(

            student_email,

            "Attendance Warning",

            f"""

            <h2>
            Attendance Warning
            </h2>

            <p>

            Dear
            {student.data['name']},

            </p>

            <p>

            Your attendance
            is below 75%.

            Please attend
            upcoming lectures
            regularly.

            </p>

            <br>

            <b>
            SmartAttend ERP
            </b>

            """ 

        )

    (
        supabase
        .table("notifications")
        .insert({

            "student_id":
                student_id,

            "receiver_type":
                "student",

            "title":
                "Attendance Warning",

            "message":
                "Your attendance is below 75%. Please improve.",

            "delivery_status":
                "unread"

        })
        .execute()
    )

    return {

        "success": True,

        "message":
            "Student notified"

    }

@router.post("/notify-parent/{student_id}")
def notify_parent(

    student_id: int,

    user=Depends(
        verify_teacher_token
    )

):

    student = (
        supabase
        .table("students")
        .select("*")
        .eq(
            "student_id",
            student_id
        )
        .single()
        .execute()
    )

    if not student.data:

        return {

            "success": False,

            "message":
                "Student not found"

        }

    parent_email = (
        student.data.get(
            "parent_email"
        )
    )

    if not parent_email:

        return {

            "success": False,

            "message":
                "Parent email not found"

        }

    send_email(

        parent_email,

        "Attendance Alert For Your Ward",

        f"""

        <html>

        <body>

            <h2>
                Attendance Alert
            </h2>

            <p>

                Dear Parent,

            </p>

            <p>

                Your ward

                <b>
                {student.data['name']}
                </b>

                currently has
                attendance below
                the required limit.

            </p>

            <p>

                Please ensure
                regular attendance.

            </p>

            <br>

            <b>
            SmartAttend ERP
            </b>

        </body>

        </html>

        """

    )

    (
        supabase
        .table(
            "notifications"
        )
        .insert({

            "student_id":
                student_id,

            "receiver_type":
                "parent",

            "title":
                "Parent Attendance Alert",

            "message":
                "Attendance warning sent to parent.",

            "delivery_status":
                "unread"

        })
        .execute()
    )

    return {

        "success": True,

        "message":
            "Parent notified successfully"

    }

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