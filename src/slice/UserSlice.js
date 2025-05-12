import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAuthLoading = false;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },
    setAuthLoading(state, action) {
      state.isAuthLoading = action.payload;
    },
    logoutUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },
  },
});

export const { setUser, clearUser, setAuthLoading, logoutUser } = userSlice.actions;
export default userSlice.reducer; // ✅ This fixes the error
