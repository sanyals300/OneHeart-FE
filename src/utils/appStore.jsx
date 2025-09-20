import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
 

const appStore = configureStore({
    reducer:{
        user: userReducer, //user is the slice which is managed by "userReducer" Reducer.//
    },
});

export default appStore;