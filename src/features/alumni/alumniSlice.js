import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  alumniData: {},
  loading: false,
  error: null,
};

// POST job thunk
export const registerAlumni = createAsyncThunkWrapper(
  "job/create",
  async (payload) => {
    console.log("🚀 API Hit Started: /jobs/create");
    const response = await client.post("/jobs/create", payload);
    console.log("🚀 ~ Job Post Response:", response);
    const { data, status } = response || {};
    return { data, status };
  }
);

const PostJobSlice = createSlice({
  name: "alumni", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerAlumni.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerAlumni.fulfilled, (state, action) => {
        console.log("🚀 ~ Job Posted:", action);
        state.loading = false;
        state.jobData = action.payload?.data?.job || {}; 
      })
      .addCase(registerAlumni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An error occurred while posting the job";
      });
  },
});

export default PostJobSlice.reducer;
