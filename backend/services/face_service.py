import cv2
import numpy as np
from PIL import Image

from ai.face_engine import process_face_image


def face_login(file):

    image = Image.open(file.file).convert("RGB")

    image_np = np.array(image)

    image_np = cv2.cvtColor(
        image_np,
        cv2.COLOR_RGB2BGR
    )

    result = process_face_image(
        image_np
    )

    return result