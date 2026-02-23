// Disclaimer: This example keeps the access token in LocalStorage just because
// it's simpler, but in a real application you may want to use cookies instead
// for better security. Also, it doesn't handle token expiration.
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_LOGIN_URL;

const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function login(data) {
  console.log("API_URL:", API_URL);
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    return null;
  }
  const { token } = await response.json();
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  return getUserFromToken(token);
}

export function getUser() {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  return getUserFromToken(token);
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function getUserFromToken(token) {
  const claims = jwtDecode(token);
  const { issueDate, expDate } = calcExpDate(claims);

  return {
    name: claims.name,
    id: claims.sub,
    email: claims.email,
    issueAt: issueDate,
    expAt: expDate,
  };
}

function calcExpDate(claims) {
  const iat = claims.iat;
  // Token lifetime in seconds (e.g., 1 hour = 3600 seconds)
  const tokenLifetime = 3600;

  // Convert iat to human-readable date
  const convertedDate = new Date(iat * 1000); // JS Date uses milliseconds
  const issueDate = convertedDate.toLocaleDateString();

  // Calculate expiration time
  const exp = iat + tokenLifetime;
  const newexp = new Date(exp * 1000);
  const expDate = newexp.toLocaleDateString();
  //console.log(expDate.toLocaleDateString()); //dateObj.toLocaleTimeString()
  //console.log("Expires At:", expDate.toUTCString());

  return { issueDate, expDate };
}
