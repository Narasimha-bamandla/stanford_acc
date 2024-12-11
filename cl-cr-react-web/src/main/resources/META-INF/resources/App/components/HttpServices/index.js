async function makeRequest(method, endpoint, params = "", body = null) {
  try {
    var requestUrl = `${endpoint}?p_auth=${Liferay.authToken}${params}`;
    const fetchOptions = {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (body && ["POST", "PUT", "PATCH"].includes(method)) {
      fetchOptions.body = JSON.stringify(body);
    }
    const result = await fetch(requestUrl, fetchOptions);
    return result;
  } catch (error) {
    return error;
  }
}
export async function GET(endpoint, params) {
  return makeRequest("GET", endpoint, params);
}
export async function DELETE(endpoint, params) {
  return makeRequest("DELETE", endpoint, params);
}
export async function POST(endpoint, params, body) {
  return makeRequest("POST", endpoint, params, body);
}
export async function PUT({ endpoint, params, body }) {
  return makeRequest("PUT", endpoint, params, body);
}

export async function PATCH(endpoint, params, body) {
  return makeRequest("PATCH", endpoint, params, body);
}
