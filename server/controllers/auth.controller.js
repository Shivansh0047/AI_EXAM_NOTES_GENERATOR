import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"

export const googleAuth = async (req,res) => { // We need res as a parameter because the controller must communicate back to the client.
    try {
        // console.log("Backend hit! Request body:", req.body);
        const {name, email} = req.body // get name and email form frontend
        let user = await UserModel.findOne({email}) // Search database for user with this email.
        if(!user){ // If no user found, create one
            user  = await UserModel.create({
                name, email
            })}
        let token = await getToken(user._id) // Generate JWT token using user id.
        res.cookie("token",token, { // Sets cookie in browser, does not immediately send the response. Instead it modifies the response object by adding a header:
            httpOnly: true, // httpOnly prevents JavaScript from reading the cookie.
            secure:true, // so cookie is only sent over HTTPS. false when we are developing
            sameSite: "none", // "lax" when we are developing
            path: "/",
            maxAge:7*24*60*60*1000
        })
        return res.status(200).json(user) // adds the response body and finally sends everything. (including cookie), .status() sets the HTTP status code of the response. Express automatically uses status 200 as ok.
    } catch (error) {
        // console.error("DATABASE/AUTH ERROR:", error); // <-- Logs to your server terminal
        return res.status(500).json({ message: `googleSignup Error ${error.message}` });
    }
}

export const logOut = async (req,res) => { // To clear cookie
    try {
        await res.clearCookie("token") // This tells Express to send a response header that removes the cookie named "token" from the browser. Although not here, it is safer to delete the cookie in the save way we have created it
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({message:`LogoutError Error ${error}`})
    }
}

// Cookies are stored in the user's browser, not on the server. When User A clicks Logout browser automatically sends Cookie: token=AAA to the server
// The server isn't deleting a cookie from some global cookie database. It's sending instructions back to the specific browser that made the request.