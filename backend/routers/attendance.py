from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

from typing import List
import numpy as np
import cv2

from ai.face_engine import (
    get_face_embeddings
)

from database.db import supabase
from fastapi import Depends
from services.teacher_auth import verify_teacher_token


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.post(
    "/analyze",
    openapi_extra={
        "requestBody": {
            "content": {
                "multipart/form-data": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "images": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "format": "binary"
                                }
                            },
                            "subject_id": {
                                "type": "integer"
                            }
                        },
                        "required": [
                            "images",
                            "subject_id"
                        ]
                    }
                }
            }
        }
    }
)
async def analyze_attendance(

    subject_id: int = Form(...),

    images: List[UploadFile] = File(...),

    user=Depends(
        verify_teacher_token
    )

):

    all_embeddings = []
    recognized_students = []

    # =====================================
    # READ IMAGES
    # =====================================

    for idx, image in enumerate(images):

        contents = await image.read()

        npimg = np.frombuffer(
            contents,
            np.uint8
        )

        img = cv2.imdecode(
            npimg,
            cv2.IMREAD_COLOR
        )

        if img is None:
            continue

        rgb = cv2.cvtColor(
            img,
            cv2.COLOR_BGR2RGB
        )

        embeddings = get_face_embeddings(
            rgb
        )

        if len(embeddings) == 0:
            continue

        for emb in embeddings:

            all_embeddings.append({

                "embedding":
                emb.tolist(),

                "source":
                f"Photo {idx+1}"
            })

    # =====================================
    # LOAD ENROLLED STUDENTS ONLY
    # =====================================

    enrolled = (

        supabase
        .table(
            "subject_students"
        )
        .select(
            "*, students(*)"
        )
        .eq(
            "subject_id",
            subject_id
        )
        .execute()

    )

    enrolled_students = (
        enrolled.data
    )

    student_data = []

    for node in enrolled_students:

        student = node.get(
            "students"
        )

        if student:

            student_data.append(
                student
            )

    matched_ids = set()

    # =====================================
    # FACE MATCH
    # =====================================

    for item in all_embeddings:

        emb_np = np.array(
            item["embedding"]
        )

        source = item[
            "source"
        ]

        for student in student_data:

            stored = student.get(
                "face_embedding"
            )

            if not stored:
                continue

            stored_np = np.array(
                stored
            )

            distance = np.linalg.norm(
                emb_np -
                stored_np
            )

            if distance < 0.50:

                sid = student[
                    "student_id"
                ]

                if sid not in matched_ids:

                    matched_ids.add(
                        sid
                    )

                    recognized_students.append({

                        "student_id":
                        sid,

                        "name":
                        student[
                            "name"
                        ],

                        "distance":
                        float(
                            distance
                        ),

                        "source":
                        source,

                        "status":
                        "Present"
                    })

    # =====================================
    # BUILD ATTENDANCE TABLE
    # =====================================

    attendance = []

    recognized_ids = {

        s["student_id"]
        for s
        in recognized_students
    }

    for student in student_data:

        sid = student[
            "student_id"
        ]

        match = next(

            (
                s
                for s
                in recognized_students
                if s[
                    "student_id"
                ] == sid
            ),

            None
        )

        if match:

            attendance.append({

                "student_id":
                sid,

                "name":
                student[
                    "name"
                ],

                "source":
                match[
                    "source"
                ],

                "status":
                "Present"
            })

        else:

            attendance.append({

                "student_id":
                sid,

                "name":
                student[
                    "name"
                ],

                "source":
                "-",

                "status":
                "Absent"
            })

    # =====================================
    # FINAL RESPONSE
    # =====================================

    return {

        "success":
        True,

        "present_count":
        len(
            recognized_students
        ),

        "students":
        recognized_students,

        "attendance":
        attendance
    }