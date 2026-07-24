const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function request(endpoint, tokenKey, options = {}) {
  const token = localStorage.getItem(tokenKey);

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

export function apiFetch(endpoint, options = {}) {
  return request(endpoint, "token", options);
}

export function teacherApiFetch(endpoint, options = {}) {
  return request(endpoint, "teacher_token", options);
}

export function adminApiFetch(endpoint, options = {}) {
  return request(endpoint, "admin_token", options);
}