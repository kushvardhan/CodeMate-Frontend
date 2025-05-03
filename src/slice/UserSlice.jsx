import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isAuthenticated: false,
    isAuthLoading: true, // Add this property
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.isAuthLoading = false; // Set loading to false when user is set
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.isAuthLoading = false; // Set loading to false when user is cleared
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
