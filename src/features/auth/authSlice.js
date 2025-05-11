import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { setItem } from "@/services/storage/setItem";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";



const initialState = {
    userData : {},
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
}
const setAccessAndRefreshToken = async (token) => {
  if (!token) return;
  client.setTokens(token, null); // Only access token
  await setItem("token", JSON.stringify({ accessToken: token }));
};

export const handleLoginApi = createAsyncThunkWrapper(
  "user/login",
  async (payload,dispatch) => {
    const response = await client.post("/auth/login", { ...payload });
    console.log("🚀 ~ responssasasse:", response);
    const { data, status } = response || {};

    if (data?.token) {
      await setAccessAndRefreshToken(data.token);
    }    
    return { data, status };

  }

);



export const handleCheckApi = createAsyncThunkWrapper(
  "user/login",
  async (payload) => {
    const response = await client.get(
      "/get-user?role=shopkeeper&userId=6747e0463ef3eee0960da38a",
      // { ...payload }
    );
    console.log("🚀 ~ responssasasse:", response);
    const { data, status } = response || {};

    if (data?.accessToken && data?.refreshToken) {
      await setAccessAndRefreshToken({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
      });
    }
    return { data, status };
  }
);

export const handleSignupApi = createAsyncThunkWrapper(
  "user/signup",
  async (payload) => {
    console.log("🚀 API Hit Started: /auth/signup");
    const response = await client.post("/auth/signup", payload,{
      "Content-Type": "multipart/form-data",
    });
    console.log("🚀 ~ Signup Response:", response);
    const { data, status } = response || {};
    return { data, status };
  }
);


// Async thunk to request password reset
export const requestPasswordReset = createAsyncThunkWrapper(
  "user/requestPasswordReset",
  async (payload) => {
    const response = await client.post("/auth/request-reset-password", {
     ...payload
    });
    const { data, status } = response || {};
    return { data, status };
  }
);

export const setNewPassword = createAsyncThunkWrapper(
  "user/setNewPassword",
  async (payload) => {
    console.log("abhiwala🚀 ~ payload:", payload)
    const response = await client.post("/auth/reset-password", {
     ...payload
    });
    const { data, status } = response || {};
    return { data, status };
  }
);

export const handleSelectRoleApi=createAsyncThunkWrapper(
  "user/selectRole",
  async({role})=>{
    console.log("api hitt",role) 
    const response=await client.post("/auth/select-role", {role})

    const {data,status} =response || {};
  return {data,status}
  }

)

export const changePassword=createAsyncThunkWrapper(
  "user/changePassword",
  async (payload) =>{
    const response=await client.post("/auth/change-password", {...payload})
    const {data,status} =response || {};
    return { data, status };
  }
)


export const handleUpdateProfile = createAsyncThunkWrapper(
  "user/updateUserProfile",
  async (payload) => {
    
    const response = await client.patch("/auth/update-profile", payload, {
      "Content-Type": "multipart/form-data",
    });
    const { data, status } = response || {};
    return { data, status };
  }
);


const authSlice = createSlice({
  name: "user", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleLoginApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleLoginApi.fulfilled, (state, action) => {
        console.log("🚀 ~  action:", action)
        state.loading = false;
        state.userData = action.payload?.data?.user || {};
        state.token = action.payload?.token || null;
      })
      .addCase(handleLoginApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An error occurred";
      });
  },
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;