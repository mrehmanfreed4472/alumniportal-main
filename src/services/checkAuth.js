import client, {isTokenExpired, parseJWT } from "@/services/apiClient";

// Get user from localStorage
export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Get token from localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || null;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("token");
  // console.log("🚀 ~ isAuthenticated ~ accessToken:", accessToken)
  if (!accessToken) return false;

  const parsed = parseJWT(accessToken);
  if (!parsed || isTokenExpired(parsed)) return false;

  return true;
};

