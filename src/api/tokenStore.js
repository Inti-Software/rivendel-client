let accessToken = null;

export function setToken(token) {
  console.log("Setting token:", token);
  accessToken = token;
}

export function getToken() {
  console.log("Getting token:", accessToken);
  return accessToken;
}

export function clearToken() {
  accessToken = null;
}
