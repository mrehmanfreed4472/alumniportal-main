
import client, { isTokenExpired, parseJWT } from "@/services/apiClient";

export const isAuthenticated = () => {
  const { accessToken } = client.getTokens();

  if (!accessToken) return false;

  const parsed = parseJWT(accessToken);
  if (!parsed || isTokenExpired(parsed)) return false;

  return true;
};
