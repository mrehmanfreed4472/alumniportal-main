import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  innovationData: [],
  loading: false,
  error: null,
};

// POST innovationSlice thunk
export const PostInnovation = createAsyncThunkWrapper(
  "innovation/create",
  async (payload) => {
    console.log("🚀 API Hit Started: /proposal");
    const response = await client.post("/proposal", payload,{
        "Content-Type": "multipart/form-data",
      });
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

export const getAllInnovation = createAsyncThunkWrapper(
  "innovation/innovationList",
  async () => {
    const response = await client.get(`/proposals`);
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

const innovationSlice = createSlice({
  name: "innovation", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllInnovation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllInnovation.fulfilled, (state, action) => {
        state.loading = false;
        state.innovationData = action.payload?.data || {}; 
      })
      .addCase(getAllInnovation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An error occurred while posting the job";
      });
  },
});

export default innovationSlice.reducer;
