import mongoose from "mongoose";

const adminRegisterSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    
    password:{
        type: String,
        required: true,
    },
    adminKey:{
        type: String,
        required: true,
        unique: true,
    }
})

export default mongoose.model("AdminRegister", adminRegisterSchema);