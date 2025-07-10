// unseenSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios  from "../api/axios";

export const fetchUnseenCounts = createAsyncThunk(
  "unseen/fetchUnseenCounts",
  async (userId) => {
    const res = await axios.get(`/chat/unseen-counts/${userId}`);
    console.log("Unseen Message: ", res.data);
    return res.data.data;
  }
);


const unseenSlice = createSlice({
  name: "unseen",
  initialState: {
    unseenChats: [],
    status: "idle",
    error: null,
  },
  reducers: {
    markChatAsSeen: (state, action) => {
      const { userId } = action.payload;
      const chat = state.unseenChats.find((c) => c.userId === userId);
      if (chat) chat.unseenCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnseenCounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnseenCounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unseenChats = action.payload;
      })
      .addCase(fetchUnseenCounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { markChatAsSeen } = unseenSlice.actions;
export default unseenSlice.reducer;
