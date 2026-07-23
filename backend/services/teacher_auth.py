from fastapi import Header, HTTPException
import jwt

SECRET_KEY = "snapclas_secret_key"

def verify_teacher_token(
    authorization: str = Header(None)
):

    print("AUTH HEADER =", authorization)

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Token Missing"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    print("TOKEN =", token)

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        print("PAYLOAD =", payload)

        if payload["role"] != "teacher":

            raise HTTPException(
                status_code=401,
                detail="Invalid Role"
            )

        return payload

    except Exception as e:

        print("JWT ERROR =", e)

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )