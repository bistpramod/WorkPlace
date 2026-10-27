const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (response.status === 204) return null;
  const data = await response
    .json()
    .catch(() => ({ message: "Unexpected server response." }));
  if (!response.ok)
    throw Object.assign(new Error(data.message || "Request failed."), {
      status: response.status,
    });
  return data;
}
