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

export const downloadPdf = async (result) => {
    try {

        // Send an asynchronous POST request to the backend server to generate the PDF.
        const response = await axios.post(serverUrl + "/api/pdf/generate-pdf", { result }, {
            // Instructs Axios to handle the incoming response data as a raw binary Object (Blob) 
            // instead of parsing it as text or JSON. Without this, the binary stream will corrupt.
            responseType: "blob",
            
            // Includes HTTP cookies, authorization headers, or TLS client certificates 
            // in cross-site (CORS) requests if your backend session management relies on them.
            withCredentials: true
        });

        // Instantiate a new Blob (Binary Large Object) using the raw binary stream data from the response.
        // We explicitly define the MIME type as "application/pdf" so the operating system and 
        // browser know exactly what kind of file format they are dealing with.
        const blob = new Blob([response.data], {
            type: "application/pdf"
        });

        // Create a temporary, unique DOMString URL representing the Blob object just created.
        // This acts as a localized pointer (`blob:http://...`) inside the browser's memory.
        const url = window.URL.createObjectURL(blob); 
        
        // Dynamically instantiate an off-screen HTML anchor (`<a>`) element in memory.
        const link = document.createElement("a");
        
        // Point the link's destination address to our temporary Blob memory URL.
        link.href = url;
        
        // The presence of the 'download' attribute forces the browser to download the linked target 
        // instead of navigating to it. The string value sets the default downloaded filename.
        link.download = "ExamNotesAI.pdf";
        
        // Programmatically trigger a click event on our invisible anchor element to execute the download.
        link.click();
        
        // This informs the browser that it no longer needs to keep the reference to the Blob file 
        // alive in memory, preventing potential memory leaks on the client side.
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        // Intercepts network failures, bad statuses, or streaming issues and bubble up a generic wrapper error.
        throw new Error("PDF download failed");
    }
};
/*
In a web browser, the window object represents the global execution context for 
JavaScript running in that tab. It is the topmost object in the browser's hierarchy Anything running in your frontend script has access to it. It represents the browser window itself and houses, Global Variables & Functions
DOM and BOM
When your backend sends raw binary data (a Blob) for a PDF, JavaScript needs a way to point to that file so the browser can download it. Because the file lives purely in the browser's temporary RAM, it doesn't have a web UR
To bridge this gap, we use window.URL.createObjectURL(blob). The browser takes the raw binary Blob data received from your Axios request and holds it securely in a dedicated block of the browser's internal RAM.
When you call window.URL.createObjectURL(blob), the browser's rendering engine generates a unique, temporary string pointer that looks something like this: blob:http://localhost:5173/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
This is a Blob URL (or Object URL). It acts as a local shorthand address. For as long as this URL exists, typing it into the browser's address bar tells the browser: "Go to RAM, find the binary data associated with this ID, and treat it like a file."
The issue with this is here it works but Axios is forced to wait until 100% of the file is downloaded over the network, buffer it completely in your browser's RAM, and only then hand it over to your code. If the file is 1 GB, your browser tab's memory usage instantly spikes by 1 GB.
To handle massive files, we stop saving the whole file in RAM. Instead, we use a Stream. Think of it like watching a movie on Netflix: you don't download the entire 2 GB movie into RAM before playing it; you process small chunks of data as they arrive, pass them to the hard drive, and clear them from RAM immediately.
*/