import { createAsyncThunk } from "@reduxjs/toolkit";

export function createAsyncThunkWrapper(
  typePrefix,
  payloadCreator,
  options = {}
) {
  const { successMessage, messageType } = options;
  return createAsyncThunk(typePrefix, async (arg, thunkApi) => {
    try {
      const response = await payloadCreator(arg, thunkApi);
      // Manually fulfilling with success message and type if needed
      return thunkApi.fulfillWithValue(response, {
        successMessage,
        messageType,
      });
    } catch (error) {
      console.log("🚀 ~ returncreateAsynsscThunk ~ error:", error?.response);
      let message = null;
      const hideToast = error?.config?.headers?.hideToast;
      if (!hideToast) {
        if (error?.message === "Network Error") {
          message = error.message;
          console.log(
            "🚀 ~ returncreateAsyncThunk ~ error.message:",
            error.message
          );
        } else if (error?.response?.data.error) {
          message = error.response.data.error;
        } else if (error?.response?.data?.message) {
          message = error.response.data?.message;
        } else {
          message = handleErrorMessage(error);
        }
      }
      // Manually rejecting with error message and type if needed
      return thunkApi.rejectWithValue(undefined, {
        errorMessage: message,
        messageType,
      });
    }
  });
}

const handleErrorMessage = (error) => {
  console.log("Error Handling:", error);

  // Check if the error response has a data object with a message
  const errorMessage = error?.response?.data?.message || "Something went wrong!";

  alert(errorMessage); // Show the actual error message
  return errorMessage;
};

