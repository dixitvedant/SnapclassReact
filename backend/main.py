from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.face import router as face_router
from routers.student import router as student_router
from routers.dashboard import router as dashboard_router
from routers.teacher import router as teacher_router
from routers.attendance import router as attendance_router
from routers.subject import router as subject_router
from routers.attendance_save import router as attendance_save_router
from routers.enroll import router as enroll_router
from routers.unenroll import router as unenroll_router
from routers.attendance_records import router as attendance_records_router
from routers.lecture_management import router as lecture_management_router
from routers.announcement import router as announcement_router
from routers.teacher_notifications import router as teacher_notifications_router
from routers.teachers_profile import router as teacher_profile_router
from routers.change_password import router as change_password_router
from routers.forgot_password import router as forgot_password_router
from routers.defaulters import router as defaulters_router
from routers.defaulter_actions import router as defaulter_actions_router
from routers.student_notifications import router as student_notifications_router
from routers.student_attendance import router as student_attendance_router
from routers.student_calendar import router as student_calendar_router
from routers.student_subject import router as student_subject_router
from routers.student_profile import router as student_profile_router
from routers.student_auth import router as student_auth_router
from routers.student_forgot import router as student_forgot_router
from routers.admin import router as admin_router


app = FastAPI(title="SmartAttend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://snapclass-react.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(face_router)
app.include_router(student_router)
app.include_router(dashboard_router)
app.include_router(teacher_router)
app.include_router(attendance_router)
app.include_router(subject_router)
app.include_router(attendance_save_router)
app.include_router(enroll_router)
app.include_router(unenroll_router)
app.include_router(attendance_records_router)
app.include_router(lecture_management_router)
app.include_router(announcement_router)
app.include_router(teacher_notifications_router)
app.include_router(teacher_profile_router)
app.include_router(change_password_router)
app.include_router(forgot_password_router)
app.include_router(defaulters_router)
app.include_router(defaulter_actions_router)
app.include_router(student_notifications_router)
app.include_router(student_attendance_router)
app.include_router(student_calendar_router)
app.include_router(student_subject_router)
app.include_router(student_profile_router)
app.include_router(student_auth_router)
app.include_router(student_forgot_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {"message": "SmartAttend API Running"}