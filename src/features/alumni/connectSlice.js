import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  connectData: [],
  loading: false,
  error: null,
};

// POST connectSlice thunk
export const PostConnection = createAsyncThunkWrapper(
  "connect/create",
  async (payload) => {
    console.log("🚀 API Hit Started: connect/connect");
    const response = await client.post("/connect/connect", payload,{
        "Content-Type": "multipart/form-data",
      });
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

export const getAllConnection = createAsyncThunkWrapper(
  "connect/connectList",
  async () => {
    const response = await client.get(`/connect/connections`);
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

const connectSlice = createSlice({
  name: "connect", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllConnection.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.connectData = action.payload?.data || {}; 
      })
      .addCase(getAllConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An error occurred while posting the job";
      });
  },
});

export default connectSlice.reducer;
