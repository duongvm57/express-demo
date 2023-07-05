import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    name: String,
    message: String,
},
    {
        timestamps: true
    },)

export default mongoose.model('Message', messageSchema);