import { createSlice } from "@reduxjs/toolkit";


const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, updateUser, logoutUser } = requestSlice.actions;
export default requestSlice.reducer;
