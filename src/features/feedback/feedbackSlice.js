import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  feedbackData: [],
  loading: false,
  error: null,
};

// POST Feedback thunk
export const PostFeedbackApi = createAsyncThunkWrapper(
  "feedback/create",
  async (payload) => {
    console.log("🚀 API Hit Started: /feedback/send-feedback");
    const response = await client.post("/feedback/send-feedback", payload);
    console.log("🚀 ~ Job Post Response:", response);
    const { data, status } = response || {};
    return { data, status };
  }
);

export const getAllFeedbacks = createAsyncThunkWrapper(
  "feedback/FeedbackList",
  async () => {
    const response = await client.get(`/feedback/get-feedback`);

    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

const feedbackSlice = createSlice({
  name: "feedback", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackData = action.payload?.data || {}; 
      })
      .addCase(getAllFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An error occurred while posting the job";
      });
  },
});

export default feedbackSlice.reducer;
