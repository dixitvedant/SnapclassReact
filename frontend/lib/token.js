export function getToken() {
  return localStorage.getItem("token");
}

export function getStudentId() {
  return localStorage.getItem("student_id");
}

export function isTokenExpired(token) {
  try {

    const payload =
      JSON.parse(
        atob(token.split(".")[1])
      );

    return (
      payload.exp * 1000 <
      Date.now()
    );

  } catch {

    return true;

  }
}