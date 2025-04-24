import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  memoryData: [],
  loading: false,
  error: null,
};

// POST Memory thunk
export const postMemory = createAsyncThunkWrapper(
  "memory/post",
  async (payload) => {
    console.log("🚀 API Hit Started: memory/post");
    const response = await client.post("/memories/create", payload, {
        "Content-Type": "multipart/form-data",
      });
    console.log("🚀 ~ Memory Post Response:", response);
    const { data, status } = response || {};
    return { data, status };
  }
);

export const getAllMemories = createAsyncThunkWrapper(
  "memory/memoryList",
  async () => {
    const response = await client.get(`/memories/all`);
    console.log("🚀 ~ memoryList ~ response:", response);

    const { data, status } = response || {};
    return { data, status };
  }
);

const memorySlice = createSlice({
  name: "memory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllMemories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMemories.fulfilled, (state, action) => {
        state.loading = false;
        state.memoryData = action.payload?.data || []; 
      })
      .addCase(getAllMemories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error fetching alumni list";
      });
  },
});

export default memorySlice.reducer;
