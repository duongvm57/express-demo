import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    gender: {
        type: String,
        default: null,
        required: true,
    },
    password: {
        type: String,
        default: null,
        required: true,
    }
},
    {
        timestamps: true
    },
);

export default mongoose.model('User', userSchema);