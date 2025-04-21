import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";


const initialState = {
    userData : {},
    loading: false,
    error: null,
}

export const getAlumniInfo=createAsyncThunkWrapper(
    "auth/AlumniInfo",
    async(userID)=>{
      const response= await client.get(`alumni/profile/${userID}`)
      console.log("🚀 ~ async ~ response:", response)
     
      const {data,status}=response || {};
      return {data,status};
    }
  )

  export const getStudentInfo=createAsyncThunkWrapper(
    "auth/StudentInfo",
    async(userID)=>{
      const response= await client.get(`student/profile/${userID}`)
      console.log("🚀 ~ async ~ response:", response)
     
      const {data,status}=response || {};
      return {data,status};
    }
  )

  const userInfoSlice=createSlice({
    name: "userInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getAlumniInfo.pending, (state) => {
          state.loading = true;
        })
        .addCase(getAlumniInfo.fulfilled, (state, action) => {
          console.log("🚀 ~ .addCase ~ actionuserInfo:", action)
          state.loading = false;
          state.userData = action.payload?.data || {};
        })
        .addCase(getAlumniInfo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "An error occurred";
        })

        .addCase(getStudentInfo.pending, (state) => {
            state.loading = true;
          })
          .addCase(getStudentInfo.fulfilled, (state, action) => {
            console.log("🚀 ~ .addCase ~ actionuserInfo:", action)
            state.loading = false;
            state.userData = action.payload?.data || {};
          })
          .addCase(getStudentInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message || "An error occurred";
          })
        ;
    },
  });
  export default userInfoSlice.reducer;