import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import userInfoSlice from "../features/auth/userInfoSlice";
import authSlice from "../features/auth/authSlice";
import PostJobSlice from "../features/jobPost/PostJobSlice"
import userInfoSlice from "../features/auth/userInfoSlice"
import alumniSlice from "../features/alumni/alumniSlice"
import memorySlice from "../features/memoery/memorySlice"

// Combine all slices into a single rootReducer
const rootReducer = combineReducers({
  user: authSlice,
  job: PostJobSlice,
  userInfo: userInfoSlice,
  alumniList: alumniSlice,
  memory: memorySlice,

});

// Reset all reducers on logout or session expiry
const appReducer = (state, action) => {
  if (action.type === "RESET_ALL") {
    state = undefined;
  }
  return rootReducer(state, action);
};

// Configure store with the combined reducer
export const store = configureStore({
  reducer: appReducer,
});

// Action to reset all reducers
export const resetAllReducers = () => ({
  type: "RESET_ALL",
});
