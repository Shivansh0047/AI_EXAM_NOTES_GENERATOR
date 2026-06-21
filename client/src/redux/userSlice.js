import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null
    },
    reducers:{ // Through which we can update userdata
        setUserData:(state,action) => { // state represents the current snapshot of your user data in the store, action is an object delivered by your application. Whatever argument you pass into your function (like setUserData(userProfileData)) gets neatly attached to action.payload.
            state.userData = action.payload // If we perform any action on setUserData, the data given in payload will be set in userData
        }
    }
})

export const {setUserData} = userSlice.actions
export default userSlice.reducer;

// Flow [ Incoming Data ]  ───►  setUserData(data)  ───►  [ Reducer Updates State ]  ───►  New Global State
// (e.g., From your API)        (Action Payload)           (Immer handles safely)         (userData: {...})

//  In Redux, you cannot change the state by calling a function directly. Instead, you must dispatch an "action"—which is a plain JavaScript object that tells Redux what you want to change. It looks like this:
// { type: "user/setUserData", payload: { name: "John Doe", email: "john@gmail.com" } }. Writing those objects manually for every single state update is tedious and error-prone. Redux Toolkit automatically creates 
// a helper function with the exact same name as your reducer (setUserData).