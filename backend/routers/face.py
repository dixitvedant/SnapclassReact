from fastapi import APIRouter, UploadFile, File
from services.face_service import face_login

router = APIRouter(
    prefix="/face",
    tags=["Face"]
)


@router.post("/login")
async def login_face(
    file: UploadFile = File(...)
):

    result = face_login(
        file
    )

    return result