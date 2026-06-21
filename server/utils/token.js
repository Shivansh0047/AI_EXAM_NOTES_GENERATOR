// Generate a token to be pushed into cookie when a new user login. To be used in controllers

import jwt from "jsonwebtoken"

export const getToken = async (userId) => {
    try {
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"7d"})
        // console.log(token);
        return token
    } catch (error) {
        console.log(error);
    }
}
