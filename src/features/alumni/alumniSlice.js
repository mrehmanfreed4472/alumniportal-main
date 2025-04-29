import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  alumniList: [],
  alumniData: [],
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

export const UpdateAlumniProfile = createAsyncThunkWrapper(
  "Alumni/Update",
  async (payload) => {
    console.log("🚀 API Hit Started: Alumni/Update");
    const response = await client.post("/alumni/profile", payload);
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

export const getAlumniList = createAsyncThunkWrapper(
  "alumni/AlumniList",
  async () => {
    const response = await client.get(`/alumni/all`);
    console.log("🚀 ~ AlumniList ~ response:", response);

    const { data, status } = response || {};
    return { data, status };
  }
);

const alumniSlice = createSlice({
  name: "alumni",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UpdateAlumniProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateAlumniProfile.fulfilled, (state, action) => {
        console.log("🚀 ~ Job Posted:", action);
        state.loading = false;
        state.alumniData = action.payload?.data || {};
      })
      .addCase(UpdateAlumniProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || "An error occurred while posting the job";
      })

      // 📌 Get alumni list (GET)
      .addCase(getAlumniList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAlumniList.fulfilled, (state, action) => {
        state.loading = false;
        state.alumniList = action.payload?.data || []; // adjust to match your API
      })
      .addCase(getAlumniList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error fetching alumni list";
      });
  },
});

export default alumniSlice.reducer;
