import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers:{
        addUser:(state, action) => {  
            return action.payload;  //The return value IS the new state.
            // Redux uses object references to detect changes. If you mutate the original object, Redux thinks nothing changed.
            // Time travel debugging: Redux DevTools can track state changes.
            // Performance: React can optimize re-renders when it knows exactly what changed
        },
        removeUser:(state, action) => {
            return null; 
        },
    }
});

export const{addUser,removeUser} = userSlice.actions;
export default userSlice.reducer;
