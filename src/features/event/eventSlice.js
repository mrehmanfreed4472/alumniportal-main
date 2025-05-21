import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  eventList: [],
  loading: false,
  error: null,
};

// POST Event thunk
export const postEvent = createAsyncThunkWrapper(
  "event/post",
  async (payload) => {
    console.log("🚀 API Hit Started: event/post");
    const response = await client.post("/memories/create", payload, {
        "Content-Type": "multipart/form-data",
      });
    console.log("🚀 ~ Memory Post Response:", response);
    const { data, status } = response || {};
    return { data, status };
  }
);

export const getAllEvents = createAsyncThunkWrapper(
  "event/eventList",
  async () => {
    const response = await client.get(`/memories/all`);
    console.log("🚀 ~ memoryList ~ response:", response);

    const { data, status } = response || {};
    return { data, status };
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.eventList = action.payload?.data || []; 
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error fetching alumni list";
      });
  },
});

export default eventSlice.reducer;
