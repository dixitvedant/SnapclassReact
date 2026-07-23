from fastapi import Header, HTTPException

from services.jwt_service import verify_token


# ======================================
# TEACHER
# ======================================

def verify_teacher_token(
    authorization: str = Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Token Missing"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    if payload.get("role") != "teacher":

        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    return payload


# ======================================
# STUDENT
# ======================================

def verify_student_token(
    authorization: str = Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Token Missing"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    if payload.get("role") != "student":

        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    return payload


# ======================================
# ADMIN
# ======================================

def verify_admin_token(
    authorization: str = Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Token Missing"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    if payload.get("role") != "admin":

        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    return payload