import axios from "axios";
import { clear } from "./storage/clear";
import { setItem } from "./storage/setItem";
import { baseURL } from "./config/apiConfig";
import { resetAllReducers, store } from "../redux/store";

export const parseJWT = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.log("Error occurred while parsing token.", e);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token?.exp) return true;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return token.exp < currentTimestamp;
};

class ApiClient {
  constructor(baseURL, headers = {}) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    this.handleRequest = this.handleRequest.bind(this);
    this.handleRequestError = this.handleRequestError.bind(this);
    this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
    this.handleErrorResponse = this.handleErrorResponse.bind(this);
    this.refreshAccessToken = this.refreshAccessToken.bind(this);
    this.setDispatch = this.setDispatch.bind(this);

    this.client.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );
    this.client.interceptors.response.use(
      this.handleSuccessResponse,
      this.handleErrorResponse
    );
  }

  setNavigation(navigation) {
    this.navigation = navigation;
  }

  handleRequest(config) {
    console.log("🚀 $$$$$$$ Request Details:", {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
      params: config.params,
      access_token: this.token,
    });
    if (this?.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }
    return config;
  }

  handleRequestError(error) {
    console.error("❌ $$$$$$ Request Error:", {
      message: error.message,
      config: error.config,
    });
    return Promise.reject(error);
  }

  handleSuccessResponse(response) {
    console.log("✅ $$$$ Response Details:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response;
  }

  async resetStorage(skipNavigation = false) {
    this.token = undefined;
    this.refreshToken = undefined;
    try {
      await clear();
      store.dispatch(resetAllReducers());
      !skipNavigation && this.navigation?.reset({
        index: 0,
        routes: [{ name: 'OnBoarding-Screen' }],
    });
    } catch (error) {
      console.log("apiClient.js - Error while resetting storage : ", error);
    }
  }

  setTokens(token, refreshToken) {
    this.token = token;
    this.refreshToken = refreshToken;
  }

  getTokens() {
    return { accessToken: this.token, refreshToken: this.refreshToken };
  }

  async handleErrorResponse(error) {
    console.log("🚀 ~ ApiClient ~ handleErrorResponse ~ error:", error);
    console.error("❌ $$$$ Response Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    if (error?.response) {
      const originalRequest = error.config;
      const { Authorization, authorization } = originalRequest.headers || {};
      const _resMessage = error?.response?.data?.message || "";
      if (
        (Authorization || authorization) &&
        (error.response.status === 401 || _resMessage.includes("401")) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const res = await this.refreshAccessToken();
        if (!res) {
          return Promise.reject(error);
        }
        this.client.defaults.headers.common["Authorization"] =
          "Bearer " + res?.accessToken;
        return this.client.request(originalRequest);
      }
      return Promise.reject(error);
    } else {
      // Something happened in setting up the request that triggered an Error
      // Log or handle according to your error policy
    }

    throw error;
  }

  async refreshAccessToken() {
    if (!this?.refreshToken) {
      alert("Session expired, Please login again.");
      return;
    }
    const parsedToken = parseJWT(this?.refreshToken);
    console.log(
      "🚀 ~ ApiClient ~ refreshAccessToken ~ parsedToken:",
      parsedToken
    );

    if (isTokenExpired(parsedToken)) {
      await this.resetStorage();
      alert("Session expired, Please login again.");
      return;
    }
    try {
      const response = await this.client.post(`${baseURL}/auth/refresh-token`, {
        refreshToken: this.refreshToken,
      });
      const { accessToken, refreshToken } = response?.data;
      if (accessToken && refreshToken) {
        this.setTokens(accessToken, refreshToken);
      } else {
        await this.resetStorage();
        return null;
      }
      await setItem("token", JSON.stringify(response?.data));
      return response?.data;
    } catch (error) {
      console.error("Error refreshing token:", error?.message);
    }
  }
  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  async get(endpoint, options) {
    try {
      const response = await this.client.get(endpoint, options);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async post(endpoint, data, headers) {
    try {
      const response = await this.client.post(endpoint, data, { headers });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async delete(endpoint, data) {
    try {
      return this.client.delete(endpoint, data);
    } catch (error) {
      throw error;
    }
  }

  async put(endpoint, data, headers) {
    try {
      return this.client.put(endpoint, data, { headers });
    } catch (error) {
      throw error;
    }
  }

  async patch(endpoint, data, headers) {
    try {
      return this.client.patch(endpoint, data, { headers });
    } catch (error) {
      throw error;
    }
  }
}

const client = new ApiClient(baseURL);
export default client;
