import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAuthLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },
  },
});

export const { setUser, clearUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
