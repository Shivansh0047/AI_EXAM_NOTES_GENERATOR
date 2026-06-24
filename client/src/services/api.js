// For fetching APIs

import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + "/api/user/currentuser",
            {withCredentials:true})
        // console.log(result.data)
        dispatch(setUserData(result.data)) // update data and dispatch to save it.
    } catch (error) {
        console.log(error);
    }
}

// React Redux hooks to let React components interact with the Redux store. We can read data from the store with useSelector, and dispatch actions using useDispatch

export const generateNotes = async (payload) => { // We have to ned data when calling this function
    try {
        const result = await axios.post(serverUrl+"/api/notes/generate-notes", payload, {withCredentials:true})
        console.log(result.data);
        return result.data
    } catch (error) {
        console.log(error);
        
    }
}