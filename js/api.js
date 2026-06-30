export const API_URL = "";

export async function postJson(path, payload) {
  if (!API_URL) {
    return { ok: false, message: "API endpoint is not configured yet.", payload };
  }
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}
