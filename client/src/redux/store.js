// redux works by defining slices for particular data which can be access in App. So we have to make slices (like of user data) and store it in store

import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice.js"

export const store = configureStore({
  reducer: { // All the slices
    user: userSlice, // Your slice state is now accessible via state.user.userData
  },
});

export default store;

// If the action creator is the messenger delivering the data payload, the reducer is the manager that sits in your global store, receives that messenger, 
// and actually executes the changes to your database state (state.userData = action.payload).