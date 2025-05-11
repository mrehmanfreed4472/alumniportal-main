import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  studentList: [],
  studentData: [],
  loading: false,
  error: null,
};

// POST job thunk
export const registerStudent = createAsyncThunkWrapper(
  "student/Create",
  async (payload) => {
    console.log("🚀 API Hit Started: student/register");
    const response = await client.post("/student/register", payload);
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

export const UpdateStudentProfile = createAsyncThunkWrapper(
  "student/Update",
  async (payload) => {
    console.log("🚀 API Hit Started: student/Update");
    const response = await client.post("/student/profile", payload);
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

export const getStudentList = createAsyncThunkWrapper(
  "student/studentList",
  async () => {
    const response = await client.get(`/student/all`);
    console.log("🚀 ~ studentList ~ response:", response);

    const { data, status } = response || {};
    return { data, status };
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UpdateStudentProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateStudentProfile.fulfilled, (state, action) => {
        console.log("🚀 ~ Job Posted:", action);
        state.loading = false;
        state.studentData = action.payload?.data || {};
      })
      .addCase(UpdateStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || "An error occurred while posting the job";
      })

      // 📌 Get student list (GET)
      .addCase(getStudentList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentList.fulfilled, (state, action) => {
        state.loading = false;
        state.studentList = action.payload?.data || []; // adjust to match your API
      })
      .addCase(getStudentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error fetching student list";
      });
  },
});

export default studentSlice.reducer;
