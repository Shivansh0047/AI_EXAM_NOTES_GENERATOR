import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim: true
    },
    credits:{
        type:Number,
        default:50,
        min:0
    },
    isCreditAvailable:{
        type:Boolean,
        default:true
    },
    notes:{
        type: [mongoose.Schema.Types.ObjectId], // we will create a model for notes to use in user ,mongoose.Schema.Types.ObjectId will tell mongoose instead of storing the entire note inside the user document, MongoDB stores only its _id, in array because there can be multiple notes
        ref:"Notes", // The ref: "Notes" is just the model name as a string. We do not need to import notes model. Mongoose will look up the model when you use push().
        default:[]
    }
}, {timestamps:true}) // timestamps true so we know that when DB is created or updated

const UserModel = mongoose.model("UserModel", userSchema) // Create Model

export default UserModel