import dotenv from "dotenv"
dotenv.config() // inject .env in index.js itself so we dont have to use it anywhere else, an even better way would be to injext it in package.json start 
import express from "express"
import connectDb from "./utils/connectDb.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors" // for maintaining conectivity between forntend and backend
import userRouter from "./routes/user.route.js"
import notesRouter from "./routes/generate.route.js"
import pdfRouter from "./routes/pdf.route.js"
import creditRouter from "./routes/credits.route.js"
import { stripeWebhook } from "./controllers/credits.controller.js"



const app = express()

app.post( // rpute for webhook, defined before json parser
    "/api/credits/webhook",
    express.raw({type:"application/json"}), stripeWebhook
)

app.use(cors(
    {origin: "https://ai-exam-notes-generatorcilent.onrender.com", // req form which url (in our case forntend), only this url req is allowed
         credentials: true, // allows cookies
         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] // can use these methods
    }

))
app.use(express.json()) // All data will be parsed in jsons
app.use(cookieParser()) // Token are correctly stored in the form of cookies

const PORT = process.env.PORT || 5000

app.get("/",(req,res) => {
    res.json({message:"AI_EXAM_NOTES_GENERATOR Backend running"})
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/notes", notesRouter)
app.use("/api/pdf", pdfRouter)
app.use("/api/credit", creditRouter)

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
    connectDb()
})
