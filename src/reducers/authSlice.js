import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
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
export const selectUser = (state) => state?.user.user;
export default UserSlice.reducer;