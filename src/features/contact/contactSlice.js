import { createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  contactData: [],
  loading: false,
  error: null,
};

// POST Contact Form thunk
export const PostContactForm = createAsyncThunkWrapper(
  "contact/create",
  async (payload) => {
    console.log("🚀 API Hit Started: /inquiry");
    const response = await client.post("/inquiry", payload);
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

export const getAllContactForm = createAsyncThunkWrapper(
  "contact/contactList",
  async () => {
    const response = await client.get(`/inquiries`);
    console.log("🚀 ~ response:", response)
    const { data, status } = response || {};
    return { data, status };
  }
);

const contactSlice = createSlice({
  name: "contact", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllContactForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllContactForm.fulfilled, (state, action) => {
        state.loading = false;
        state.contactData = action.payload?.data || {}; 
      })
      .addCase(getAllContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An error occurred while posting the job";
      });
  },
});

export default contactSlice.reducer;
