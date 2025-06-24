import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload;
    },
    clearUser(state) {
      state.userInfo = null;
    }
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUserInfo = (state) => state.userInfo.userInfo;
export default userSlice.reducer;
