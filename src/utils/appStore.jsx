import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestsReducer from "./requestsSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer, //user is the slice which is managed by "userReducer" Reducer.//
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestsReducer,
  },
});

export default appStore;
