export const API_URL = "/api";

function getHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };
  const token = sessionStorage.getItem("airb:token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function request(method, path, body = null) {
  const options = {
    method,
    headers: getHeaders()
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${path}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error on ${method} ${path}:`, error);
    return { ok: false, message: "Network connection error. Check if backend is running." };
  }
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path)
};

// Keep for backward compatibility if other modules call it
export async function postJson(path, payload) {
  return request("POST", path, payload);
}
