from fastapi import APIRouter
from database.db import supabase
from fastapi import Depends
from services.teacher_auth import (
    verify_teacher_token
)

router = APIRouter(
    prefix="/teacher-notifications",
    tags=["Teacher Notifications"]
)

# =====================================
# GET TEACHER NOTIFICATIONS
# =====================================

@router.get("/teacher")
def get_notifications(

    user=Depends(
        verify_teacher_token
    )

):

    teacher_id = user["teacher_id"]

    res = (
        supabase
        .table(
            "notifications"
        )
        .select(
            "*"
        )
        .eq(
            "receiver_type",
            "teacher"
        )
        .eq(
            "teacher_id",
            teacher_id
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    unread = len([

        n

        for n in
        res.data

        if n.get(
            "delivery_status"
        ) != "read"
    ])

    return {

        "success":
            True,

        "notifications":
            res.data,

        "unread":
            unread
    }


# =====================================
# MARK READ
# =====================================

@router.put("/read/{notification_id}")
def mark_read(

    notification_id: int,

    user=Depends(
        verify_teacher_token
    )

):
    
    teacher_id = user["teacher_id"]
    (
    supabase
    .table("notifications")
    .update({

        "delivery_status": "read"

    })
    .eq(
        "notification_id",
        notification_id
    )
    .eq(
        "teacher_id",
        teacher_id
    )
    .execute()
)

    return {

        "success":
            True,

        "message":
            "Marked read"
    }


# =====================================
# DELETE
# =====================================

@router.delete("/delete/{notification_id}")
def delete_notification(

    notification_id: int,

    user=Depends(
        verify_teacher_token
    )

):
    teacher_id = user["teacher_id"]

    (
    supabase
    .table("notifications")
    .delete()
    .eq(
        "notification_id",
        notification_id
    )
    .eq(
        "teacher_id",
        teacher_id
    )
    .execute()
)
    
    return {

        "success":
            True,

        "message":
            "Notification deleted"
    }