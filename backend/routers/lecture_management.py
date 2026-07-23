from fastapi import APIRouter
from database.db import supabase
from dotenv import load_dotenv
import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import Depends

from services.teacher_auth import (
    verify_teacher_token
)

load_dotenv()

EMAIL_ID = os.getenv(
    "EMAIL_ID"
)

EMAIL_PASSWORD = os.getenv(
    "EMAIL_PASSWORD"
)
router = APIRouter(
    prefix="/lecture-management",
    tags=["Lecture Management"]
)

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


# =====================================
# CORRECTION MAIL TEMPLATE
# =====================================

def correction_mail_template(
    student_name,
    subject_name,
    old_status,
    new_status
):

    return f"""

    <html>

    <body style="
        margin:0;
        background:#f4f7fc;
        font-family:Arial;
    ">

        <table width="100%"
        style="padding:40px;">

        <tr>
        <td align="center">

        <table width="650"
        style="
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
                text-align:center;
                padding:35px;
            ">

                <h1>
                    Attendance Correction
                </h1>

                <p>
                    SnapClass ERP Notification
                </p>

            </td>

            </tr>

            <tr>

            <td style="padding:35px;">

                <h2>
                    Attendance Updated
                </h2>

                <p>
                    Dear {student_name},

                    <br><br>

                    Attendance has
                    been corrected
                    by faculty.
                </p>

                <div style="
                    background:#f8fafc;
                    border-left:
                    5px solid #7c3aed;
                    padding:20px;
                    border-radius:12px;
                ">

                    <p>
                    <b>Subject:</b>
                    {subject_name}
                    </p>

                    <p>
                    <b>Previous:</b>
                    {old_status}
                    </p>

                    <p>
                    <b>Updated:</b>
                    {new_status}
                    </p>

                </div>

                <p style="
                    margin-top:25px;
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

# =========================================
# GET TEACHER LECTURE SESSIONS
# =========================================
@router.get("/teacher")
def get_teacher_lectures(

    limit: int = 5,

    user=Depends(
        verify_teacher_token
    )

):

    teacher_id = user["teacher_id"]

    subject_res = (
        supabase
        .table("subject")
        .select(
            "subject_id"
        )
        .eq(
            "teacher_id",
            teacher_id
        )
        .execute()
    )

    subject_ids = [

        s[
            "subject_id"
        ]

        for s in
        subject_res.data
    ]

    if not subject_ids:

        return {

            "success":
                True,

            "sessions":
                []
        }

    session_res = (
        supabase
        .table(
            "attendence_sessions"
        )
        .select(
            """
            *,
            subject(
                subject_id,
                name,
                subject_code
            )
            """
        )
        .in_(
            "subject_id",
            subject_ids
        )
        .order(
            "lecture_time",
            desc=True
        )
        .limit(
            limit
        )
        .execute()
    )
    print("Sessions =", session_res.data)

    return {

        "success":
            True,

        "sessions":
            session_res.data
    }


# =========================================
# VIEW LECTURE DETAILS
# =========================================
@router.get("/view/{session_id}")
def view_lecture(

    session_id: int,

    user=Depends(
        verify_teacher_token
    )

):

    logs_res = (
        supabase
        .table(
            "attendence_logs"
        )
        .select(
            """
            id,
            is_present,
            students(
                student_id,
                name
            )
            """
        )
        .eq(
            "session_id",
            session_id
        )
        .execute()
    )

    logs = logs_res.data
    session = (
        supabase
        .table("attendence_sessions")
        .select("teacher_id")
        .eq("session_id", session_id)
        .single()
        .execute()
    )

    if session.data["teacher_id"] != user["teacher_id"]:

        return {

            "success": False,

            "message": "Access Denied"

        }

    present = len([

        l

        for l in logs

        if l[
            "is_present"
        ]
    ])

    total = len(
        logs
    )

    absent = (
        total
        -
        present
    )

    return {

        "success":
            True,

        "summary": {

            "students":
                total,

            "present":
                present,

            "absent":
                absent
        },

        "logs":
            logs
    }


# =========================================
# EDIT LECTURE ATTENDANCE
# =========================================

@router.put("/edit/{session_id}")
def edit_lecture(
    session_id: int,
    payload: dict,
    user=Depends(verify_teacher_token)
):

    logs = payload.get(
        "logs",
        []
    )

    mail_sent = 0

    # =====================================
    # GET SESSION + SUBJECT
    # =====================================

    session_data = (
        supabase
        .table(
            "attendence_sessions"
        )
        .select(
            "subject_id"
        )
        .eq(
            "session_id",
            session_id
        )
        .single()
        .execute()
    )

    subject_id = (
        session_data.data[
            "subject_id"
        ]
    )

    subject_res = (
        supabase
        .table(
            "subject"
        )
        .select(
            "name"
        )
        .eq(
            "subject_id",
            subject_id
        )
        .single()
        .execute()
    )

    subject_name = (
        subject_res.data.get(
            "name",
            "Subject"
        )
    )

    # =====================================
    # UPDATE + MAIL
    # =====================================

    for row in logs:

        old_log = (
            supabase
            .table(
                "attendence_logs"
            )
            .select(
                """
                student_id,
                is_present
                """
            )
            .eq(
                "id",
                row["id"]
            )
            .single()
            .execute()
        )

        old_data = (
            old_log.data
        )

        old_status = (
            old_data[
                "is_present"
            ]
        )

        new_status = (
            row[
                "is_present"
            ]
        )

        # UPDATE DB

        (
            supabase
            .table(
                "attendence_logs"
            )
            .update({

                "is_present":
                    new_status

            })
            .eq(
                "id",
                row[
                    "id"
                ]
            )
            .execute()
        )

        # =================================
        # SEND ONLY IF CHANGED
        # =================================

        if old_status != new_status:

            student_id = (
                old_data[
                    "student_id"
                ]
            )

            student_res = (
                supabase
                .table(
                    "students"
                )
                .select(
                    """
                    name,
                    student_email,
                    parent_email
                    """
                )
                .eq(
                    "student_id",
                    student_id
                )
                .single()
                .execute()
            )

            student = (
                student_res.data
            )

            body = (
                correction_mail_template(
                    student.get(
                        "name"
                    ),
                    subject_name,
                    "Present"
                    if old_status
                    else
                    "Absent",
                    "Present"
                    if new_status
                    else
                    "Absent"
                )
            )

            subject_line = (
                f"Attendance Correction - {subject_name}"
            )

            # STUDENT

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

                mail_sent += 1

            # PARENT

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

                mail_sent += 1

    # =====================================
    # UPDATE SESSION COUNTS
    # =====================================

    latest_logs = (
        supabase
        .table(
            "attendence_logs"
        )
        .select(
            "is_present"
        )
        .eq(
            "session_id",
            session_id
        )
        .execute()
    )

    total = len(
        latest_logs.data
    )

    present = len([

        l

        for l in
        latest_logs.data

        if l[
            "is_present"
        ]
    ])

    (
        supabase
        .table(
            "attendence_sessions"
        )
        .update({

            "present_students":
                present,

            "total_students":
                total
        })
        .eq(
            "session_id",
            session_id
        )
        .execute()
    )

    # =====================================
    # TEACHER NOTIFICATION
    # =====================================

    teacher_res = (
        supabase
        .table(
            "attendence_sessions"
        )
        .select(
            "teacher_id"
        )
        .eq(
            "session_id",
            session_id
        )
        .single()
        .execute()
    )

    teacher_id = (
        teacher_res.data[
            "teacher_id"
        ]
    )

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
                "Lecture Corrected",

            "message":
                f"{mail_sent} correction mail(s) sent",

            "delivery_status":
                "unread"

        })
        .execute()
    )

    return {

        "success":
            True,

        "message":
            "Lecture updated",

        "mail_sent":
            mail_sent
    }

# =========================================
# DELETE LECTURE
# =========================================
@router.delete(
    "/delete/{session_id}"
)
def delete_lecture(

    session_id: int,

    user=Depends(
        verify_teacher_token
    )

):  # =====================================
    # VERIFY TEACHER
    # =====================================

    session = (

        supabase
        .table(
            "attendence_sessions"
        )
        .select(
            "teacher_id"
        )
        .eq(
            "session_id",
            session_id
        )
        .single()
        .execute()

    )

    if not session.data:

        return {

            "success": False,

            "message": "Lecture not found"

        }

    if session.data["teacher_id"] != user["teacher_id"]:

        return {

            "success": False,

            "message": "Access Denied"

        }

    teacher_id = session.data["teacher_id"]
    (
        supabase
        .table(
            "attendence_logs"
        )
        .delete()
        .eq(
            "session_id",
            session_id
        )
        .execute()
    )

    (
        supabase
        .table(
            "attendence_sessions"
        )
        .delete()
        .eq(
            "session_id",
            session_id
        )
        .execute()
    )

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
                "Lecture Deleted",

            "message":
                "Lecture removed",

            "delivery_status":
                "unread"

        })
        .execute()
    )

    return {

        "success":
            True,

        "message":
            "Lecture deleted"
    }