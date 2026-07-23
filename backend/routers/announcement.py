
from fastapi import (
    APIRouter,
    Form,
    UploadFile,
    File
)

from supabase import create_client
from dotenv import load_dotenv
import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from fastapi import Depends
from services.teacher_auth import verify_teacher_token

load_dotenv()

router = APIRouter(
    prefix="/announcement",
    tags=["Announcement"]
)

# =====================================
# ENV
# =====================================

EMAIL_ID = os.getenv(
    "EMAIL_ID"
)

EMAIL_PASSWORD = os.getenv(
    "EMAIL_PASSWORD"
)

# =====================================
# SUPABASE
# =====================================

SUPABASE_URL = os.getenv(
    "SUPABASE_URL"
)

SUPABASE_KEY = os.getenv(
    "SUPABASE_KEY"
)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)
# =====================================
# PREMIUM ANNOUNCEMENT TEMPLATE
# =====================================

def announcement_mail_template(
    title,
    message,
    announcement_type
):

    type_colors = {

        "Holiday":
        "#16a34a",

        "Cancelled":
        "#dc2626",

        "Exam":
        "#7c3aed",

        "Notes":
        "#2563eb",

        "Announcement":
        "#ea580c"
    }

    badge_color = type_colors.get(
        announcement_type,
        "#7c3aed"
    )

    return f"""

    <html>

    <body style="
        margin:0;
        background:#f4f7fc;
        font-family:Arial;
    ">

        <table width="100%" style="
            padding:40px 0;
            background:#f4f7fc;
        ">

        <tr>
        <td align="center">

        <table width="650" style="
            background:white;
            border-radius:20px;
            overflow:hidden;
            box-shadow:
            0 8px 30px rgba(0,0,0,0.08);
        ">

            <tr>

            <td style="
                background:#7c3aed;
                color:white;
                padding:35px;
                text-align:center;
            ">

                <h1 style="
                    margin:0;
                    font-size:34px;
                ">
                    📢 SnapClass
                </h1>

                <p style="
                    margin-top:8px;
                    opacity:0.95;
                ">
                    Academic Announcement System
                </p>

            </td>

            </tr>

            <tr>

            <td style="padding:40px;">

                <div style="
                    background:{badge_color};
                    color:white;
                    display:inline-block;
                    padding:8px 18px;
                    border-radius:999px;
                    font-size:13px;
                    font-weight:bold;
                ">
                    {announcement_type}
                </div>

                <h2 style="
                    color:#0f172a;
                    margin-top:25px;
                    font-size:30px;
                ">
                    {title}
                </h2>

                <p style="
                    color:#64748b;
                    line-height:1.8;
                ">
                    Dear Student,

                    <br><br>

                    Please review the
                    following academic update.
                </p>

                <div style="
                    background:#f8fafc;
                    border-left:
                    5px solid {badge_color};
                    padding:22px;
                    border-radius:12px;
                    margin-top:25px;
                    color:#334155;
                    line-height:1.8;
                ">

                    {message}

                </div>

                <div style="
                    margin-top:25px;
                    background:#f5f3ff;
                    padding:16px;
                    border-radius:10px;
                    color:#6d28d9;
                ">

                    📎
                    Check attachment
                    if provided.

                </div>

                <p style="
                    margin-top:30px;
                    color:#475569;
                ">

                    Regards,
                    <br>
                    <b>SnapClass Faculty</b>

                </p>

            </td>

            </tr>

            <tr>

            <td style="
                background:#f8fafc;
                text-align:center;
                padding:18px;
                font-size:12px;
                color:#64748b;
            ">

                © 2026 SnapClass

            </td>

            </tr>

        </table>

        </td>
        </tr>
        </table>

    </body>

    </html>
    """
# =====================================
# SEND EMAIL SMTP
# =====================================

def send_email(
    to_email,
    subject,
    body,
    file=None
):

    try:

        msg = MIMEMultipart()

        msg["From"] = (
            f"SnapClass <{EMAIL_ID}>"
        )

        msg["To"] = to_email

        msg["Subject"] = subject

        msg.attach(
            MIMEText(
                body,
                "html"
            )
        )

        # ATTACH FILE
        if file:

            part = MIMEBase(
                "application",
                "octet-stream"
            )

            file.file.seek(0)

            part.set_payload(
                file.file.read()
            )

            encoders.encode_base64(
                part
            )

            part.add_header(
                "Content-Disposition",
                f"attachment; filename={file.filename}"
            )

            msg.attach(
                part
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


# =====================================
# GET ANNOUNCEMENTS
# =====================================

@router.get("/teacher")
def get_announcements(

    user = Depends(
        verify_teacher_token
    )

):
    teacher_id = user["teacher_id"]
    try:

        result = (
            supabase
            .table(
                "notifications"
            )
            .select("*")
            .eq(
                "teacher_id",
                teacher_id
            )
            .not_.is_(
                "announcement_type",
                "null"
            )
            .order(
                "created_at",
                desc=True
            )
            .execute()
        )

        return {
            "success": True,
            "announcements":
            result.data
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# =====================================
# CREATE ANNOUNCEMENT
# =====================================

@router.post("/create")
async def create_announcement(

    subject_id: int = Form(...),

    title: str = Form(...),

    message: str = Form(...),

    announcement_type: str = Form(...),

    file: UploadFile | None = File(None),

    user = Depends(
        verify_teacher_token
    )

):
    teacher_id = user["teacher_id"]

    try:

        enrolled_students = (
        supabase
        .table("subject_students")
        .select("student_id")
        .eq(
            "subject_id",
            subject_id
        )
        .execute()
    )

        students_data = (
            enrolled_students.data
        )

        sent_count = 0

        for student in students_data:

            student_info = (
                supabase
                .table("students")
                .select(
                    "student_id,student_email"
                )
                .eq(
                    "student_id",
                    student["student_id"]
                )
                .single()
                .execute()
            )

            email = student_info.data[
                "student_email"
            ]

            if not email:
                continue

            body = (
                announcement_mail_template(
                    title,
                    message,
                    announcement_type
                )
                    )

            ok = send_email(
                email,
                title,
                body,
                file
            )

            supabase.table(
                "notifications"
            ).insert({

                "student_id":
                student[
                    "student_id"
                ],
                
                "subject_id":
                subject_id,

                "teacher_id":
                teacher_id,

                "receiver_type":
                "student",

                "title":
                title,

                "message":
                message,

                "announcement_type":
                announcement_type,

                "delivery_type":
                "mail",

                "delivery_status":
                (
                    "sent"
                    if ok
                    else
                    "failed"
                ),

                "receiver_email":
                email,

                "file_url":
                (
                    file.filename
                    if file
                    else None
                )

            }).execute()

            if ok:
                sent_count += 1
            (
            supabase
            .table(
                "notifications"
            )
            .insert({

                "teacher_id":
                    teacher_id,

                "receiver_type":
                    "teacher",

                "title":
                    "Announcement Sent",

                "message":
                    f"{sent_count} mail(s) sent",

                "delivery_status":
                    "unread"

            })
    .execute()
)
            
        return {

            "success":
            True,

            "message":
            "Announcement Sent",

            "students":
            sent_count
        }

    except Exception as e:
        
        return {
            "success":
            False,
            "message":
            str(e)
        }
