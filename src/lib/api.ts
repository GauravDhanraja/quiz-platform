export async function refreshToken() {
  try {
    const res = await fetch("/api/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } else {
      console.log("Failed to refresh token:", data.message);
      return null;
    }
  } catch (error) {
    console.log("Error refreshing token:", error);
    return null;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    token = await refreshToken();
    if (!token) return null;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(`Request to ${url} got status:`, res.status);

  if (res.status === 401) {
    token = await refreshToken();
    if (!token) return res;

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return res;
}
