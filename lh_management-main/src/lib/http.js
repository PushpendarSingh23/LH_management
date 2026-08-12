// Minimal fetch-based HTTP client used in place of axios.
//
// Every backend call in this app was written against axios's calling
// convention (http.get(url, { params }), http.post(url, body), a resolved
// promise shaped like { status, data }, and a rejected promise whose error
// carries err.response.data / err.response.status). Reproducing that same
// shape here means every call site keeps working unchanged aside from the
// import switching from "axios" to this module.
//
// credentials are always sent ("include"), matching the withCredentials:
// true that every axios call in this app used - the app is cookie
// (httpOnly JWT) authenticated, not token-header authenticated.

function buildUrl(url, params) {
  if (!params) return url;
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  ).toString();
  if (!query) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${query}`;
}

async function parseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }
  const text = await response.text().catch(() => "");
  return text || null;
}

async function request(method, url, { data, params, headers, ...rest } = {}) {
  const finalUrl = buildUrl(url, params);
  const finalHeaders = { ...(headers || {}) };
  let body;
  if (data !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  const response = await fetch(finalUrl, {
    method,
    credentials: "include",
    headers: finalHeaders,
    body,
    ...rest,
  });

  const responseData = await parseBody(response);
  const result = { status: response.status, data: responseData, headers: response.headers };

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.response = result;
    throw error;
  }

  return result;
}

const http = {
  get: (url, config) => request("GET", url, config),
  post: (url, data, config) => request("POST", url, { ...config, data }),
  put: (url, data, config) => request("PUT", url, { ...config, data }),
  delete: (url, config) => request("DELETE", url, config),
};

export default http;
