import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    requests: [], // ✅ Proper structure with requests array
  },
  reducers: {
    addRequests: (state, action) => {
      state.requests = action.payload; // ✅ Update the requests property
    },
    removeRequests: (state) => {
      state.requests = []; // ✅ Clear the requests array
    },
  },
});

export const { addRequests, removeRequests } = requestsSlice.actions;

export default requestsSlice.reducer;
