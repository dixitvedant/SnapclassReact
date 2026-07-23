import { getToken } from "./token";

export async function authFetch(
  url,
  options = {}
) {

  const token = getToken();

  const headers = {

    ...options.headers,

    Authorization:
      `Bearer ${token}`

  };

  const response =
    await fetch(url, {

      ...options,

      headers

    });

  if (response.status === 401) {

    localStorage.clear();

    window.location.href =
      "/student/login";

    return;
  }

  return response;
}