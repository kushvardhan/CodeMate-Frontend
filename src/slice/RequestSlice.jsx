import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequest: (state, action) => {
      state.push(action.payload);
    },
    removeRequest: (state, action) =>
      state.filter((request) => request._id !== action.payload),
  },
});


export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
