// We will use token to find user id in isAuth middleware
import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => { 
    try {
        let {token} = req.cookies // Access cookie
        if(!token){
            return res.status(400).json({message:"Token is not found"})
        }
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)
        if(!verifyToken){
            return res.status(400).json({message:"Token not valid"})
        }
        req.userId = verifyToken.userId // now we can access the userid form token
        next()
    } catch (error) {
        return res.status(500).json({message:`is auth error ${error}`})
    }
}

export default isAuth