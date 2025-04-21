import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  jobData: {},
  loading: false,
  error: null,
};

// POST job thunk
export const PostJobApi = createAsyncThunkWrapper(
  "job/create",
  async (payload) => {
    console.log("🚀 API Hit Started: /jobs/create");
    const response = await client.post("/jobs/create", payload, {
      "Content-Type": "multipart/form-data",
    });
    console.log("🚀 ~ Job Post Response:", response);
    const { data, status } = response || {};
    return { data, status };
  }
);

const PostJobSlice = createSlice({
  name: "job", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PostJobApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostJobApi.fulfilled, (state, action) => {
        console.log("🚀 ~ Job Posted:", action);
        state.loading = false;
        state.jobData = action.payload?.data?.job || {}; 
      })
      .addCase(PostJobApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An error occurred while posting the job";
      });
  },
});

export default PostJobSlice.reducer;
