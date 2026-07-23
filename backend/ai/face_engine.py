# ============================================================
# FASTAPI FACE ENGINE
# DLIB + FACE RECOGNITION
# ============================================================

import dlib
import numpy as np
import face_recognition_models

from functools import lru_cache
from database.db import get_all_students


# ============================================================
# LOAD DLIB MODELS
# ============================================================

@lru_cache()
def load_dlib_models():

    detector = dlib.get_frontal_face_detector()

    sp = dlib.shape_predictor(
        face_recognition_models.pose_predictor_model_location()
    )

    facerec = dlib.face_recognition_model_v1(
        face_recognition_models.face_recognition_model_location()
    )

    return detector, sp, facerec


# ============================================================
# FACE EMBEDDING
# ============================================================

def get_face_embeddings(image_np):

    detector, sp, facerec = load_dlib_models()

    faces = detector(image_np, 1)

    print("Faces detected:", len(faces))

    encodings = []

    for face in faces:

        shape = sp(image_np, face)

        face_descriptor = facerec.compute_face_descriptor(
            image_np,
            shape,
            1
        )

        encodings.append(
            np.array(face_descriptor)
        )

    return encodings


# ============================================================
# LOAD STUDENT EMBEDDINGS
# ============================================================

@lru_cache()
def load_student_embeddings():

    student_db = get_all_students()

    student_embeddings = {}

    if not student_db:
        print("No students found in DB")
        return {}

    print("Students loaded:", len(student_db))

    for student in student_db:

        student_id = student.get("student_id")
        embedding = student.get("face_embedding")

        if not embedding:
            continue

        embedding_np = np.array(embedding)

        if student_id not in student_embeddings:
            student_embeddings[student_id] = []

        student_embeddings[student_id].append(
            embedding_np
        )

    print(
        "Embeddings loaded:",
        len(student_embeddings)
    )

    return student_embeddings


# ============================================================
# RELOAD CACHE
# ============================================================

def reload_embeddings():

    load_student_embeddings.cache_clear()

    return load_student_embeddings()


# ============================================================
# FACE LOGIN PREDICTION
# ============================================================

def process_face_image(image_np):

    detected_face_embeddings = get_face_embeddings(
        image_np
    )

    if not detected_face_embeddings:

        return {
            "success": False,
            "message": "No face detected"
        }

    student_embeddings_db = load_student_embeddings()

    if not student_embeddings_db:

        return {
            "success": False,
            "message": "No registered students"
        }

    for detected_embedding in detected_face_embeddings:

        best_match_student = None
        best_match_distance = 999

        for student_id, stored_embeddings in student_embeddings_db.items():

            for stored_embedding in stored_embeddings:

                distance = np.linalg.norm(
                    stored_embedding - detected_embedding
                )

                if distance < best_match_distance:

                    best_match_distance = distance
                    best_match_student = student_id

        # DEBUG OUTPUT
        print(
            "Best Match:",
            best_match_student,
            "Distance:",
            best_match_distance
        )

        THRESHOLD = 0.55

        if best_match_distance < THRESHOLD:

            return {
                "success": True,
                "student_id": best_match_student,
                "distance": float(best_match_distance)
            }

    return {
        "success": False,
        "message": "Face not recognized",
        "best_distance": float(best_match_distance)
    }