import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
};

// Helper function to extract token from user object
export const getUserToken = (user) => {
  if (!user) {
    return null;
  }
  
  // Handle case where user might be the full API response
  if (user.success !== undefined && user.data) {
    const token = user.data.token || user.data;
    return token;
  }
  
  // Handle case where user is the direct user object
  if (user.token) {
    return user.token;
  }
  
  // Fallback: treat user as the token itself
  return user;
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      Cookies.set("user", JSON.stringify(action.payload));
    },

    logout(state) {
      localStorage.clear("user");
      Cookies.remove("user");
      state.user = null;
    },
  },
});

export const { addUser, logout } = UserSlice.actions;
export const selectUser = (state) => state.user.user;
export default UserSlice.reducer;