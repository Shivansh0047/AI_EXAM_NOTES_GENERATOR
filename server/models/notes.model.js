import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required:true
    },
    topic:{
        type:String,
        required:true,
    },
    classLevel: String,
    examType: String,

    revisionMode:{
        type:Boolean,
        default:true
    },
    includeDiagram: Boolean,
    includeChart: Boolean,

    content :{
        type: mongoose.Schema.Types.Mixed, // AI respose can be mixed
        required: true
    }
}, {timestamps:true})

const NotesModel = mongoose.model("Notes", notesSchema) // Create Model

export default NotesModel