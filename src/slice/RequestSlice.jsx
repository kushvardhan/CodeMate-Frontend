import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequest: (state, action) => {
  return action.payload;
},
    removeRequest: (state, action) =>
      state.filter((request) => request._id !== action.payload),
  },
});

export default requestSlice.reducer; 
export const { addRequest, removeRequest } = requestSlice.actions;
