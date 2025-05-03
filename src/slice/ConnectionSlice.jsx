import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: [],
  reducers: {
    addConnection: (state, action) => {
      return action.payload; // Replace the state with the new payload
    },
  },
});

export const { addConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
