import express from "express"
import dotenv from "dotenv"
import connectDb from "./utils/connectDb.js"
dotenv.config() // inject .env in index.js itself so we dont have to use it anywhere else


const app = express()
const PORT = process.env.PORT || 5000

app.get("/",(req,res) => {
    res.json({message:"AI_EXAM_NOTES_GENERATOR Backend running"})
})
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
    connectDb()
})