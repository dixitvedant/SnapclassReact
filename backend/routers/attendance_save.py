
from fastapi import APIRouter
from database.db import supabase
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import Depends
from services.teacher_auth import verify_teacher_token

load_dotenv()

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance Save"]
)

EMAIL_ID = os.getenv("EMAIL_ID")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


class AttendanceItem(BaseModel):
    student_id: int
    status: str


class AttendanceSaveRequest(BaseModel):
    subject_id: int
    attendance: List[AttendanceItem]

# =====================================
# ATTENDANCE MAIL TEMPLATE
# =====================================

def attendance_mail_template(
    student_name,
    subject_name,
    status
):

    color = (
        "#16a34a"
        if status.lower() == "present"
        else "#dc2626"
    )

    emoji = (
        "✅"
        if status.lower() == "present"
        else "❌"
    )

    return f"""

    <html>

    <body style="
        margin:0;
        background:#f4f7fc;
        font-family:Arial;
    ">

        <table width="100%"
        style="
            padding:40px;
            background:#f4f7fc;
        ">

        <tr>
        <td align="center">

        <table width="650"
        style="
            background:white;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 8px 30px rgba(0,0,0,0.08);
        ">

            <tr>
            <td style="
                background:#7c3aed;
                color:white;
                text-align:center;
                padding:35px;
            ">
                <h1 style="margin:0;">
                    SnapClass Attendance
                </h1>

                <p style="margin-top:10px;">
                    Smart Attendance Notification
                </p>
            </td>
            </tr>

            <tr>
            <td style="padding:40px;">

                <h2 style="
                    color:#0f172a;
                    margin-top:0;
                ">
                    {emoji} Attendance Update
                </h2>

                <p style="
                    color:#475569;
                    line-height:1.8;
                ">
                    Dear {student_name},
                    <br><br>

                    Attendance has been recorded.
                </p>

                <div style="
                    background:#f8fafc;
                    border-left:5px solid {color};
                    border-radius:12px;
                    padding:20px;
                    margin-top:20px;
                ">

                    <p>
                    <b>Subject:</b>
                    {subject_name}
                    </p>

                    <p>
                    <b>Status:</b>
                    <span style="
                        color:{color};
                        font-weight:bold;
                    ">
                        {status}
                    </span>
                    </p>

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

        </table>

        </td>
        </tr>

        </table>

    </body>

    </html>
    """


# =====================================
# SEND EMAIL
# =====================================

def send_email(
    to_email,
    subject,
    body
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


@router.post("/save")
async def save_attendance(

    data: AttendanceSaveRequest,

    user=Depends(
        verify_teacher_token
    )

):
    teacher_id = int(user["teacher_id"])
    # =========================
    # CREATE SESSION
    # =========================

    session = (
        supabase
        .table(
            "attendence_sessions"
        )
        .insert({

            "teacher_id":
            teacher_id,

            "subject_id":
            data.subject_id

        })
        .execute()
    )

    session_id = (
        session
        .data[0]
        [
            "session_id"
        ]
    )

    # =========================
    # SUBJECT
    # =========================

    subject_data = (
        supabase
        .table(
            "subject"
        )
        .select(
            "name"
        )
        .eq(
            "subject_id",
            data.subject_id
        )
        .single()
        .execute()
    )

    subject_name = (
        subject_data.data.get(
            "name",
            "Subject"
        )
    )

    # =========================
    # SAVE LOGS
    # =========================

    logs = []

    for item in data.attendance:

        logs.append({

            "session_id":
            session_id,

            "subject_id":
            data.subject_id,

            "student_id":
            item.student_id,

            "is_present":
            item.status.lower() == "present"

        })

    (
        supabase
        .table(
            "attendence_logs"
        )
        .insert(
            logs
        )
        .execute()
    )

    # =========================
    # SEND MAIL
    # =========================

    mail_count = 0

    for item in data.attendance:

        student_res = (
            supabase
            .table(
                "students"
            )
            .select(
                "name,student_email,parent_email"
            )
            .eq(
                "student_id",
                item.student_id
            )
            .single()
            .execute()
        )

        student = (
            student_res.data
        )

        if not student:
            continue

        body = attendance_mail_template(
            student.get(
                "name"
            ),
            subject_name,
            item.status
        )

        subject_line = (
            f"Attendance Update - {subject_name}"
        )

        if student.get(
            "student_email"
        ):

            send_email(
                student[
                    "student_email"
                ],
                subject_line,
                body
            )

            mail_count += 1

        if student.get(
            "parent_email"
        ):

            send_email(
                student[
                    "parent_email"
                ],
                subject_line,
                body
            )

            mail_count += 1


    # =====================================
    # TEACHER NOTIFICATION
    # =====================================

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
                "Attendance Saved",

            "message":
                f"{mail_count} mail(s) sent",

            "delivery_status":
                "unread"

        })
        .execute()
    )

    return {

        "success": True,
        "session_id": session_id,
        "mail_sent": mail_count

    }
