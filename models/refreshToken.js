import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    expireDate: Date
});

RefreshTokenSchema.statics.createToken = async function (user) {
    let expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds() + process.env.REFRESH_TOKEN_EXPIRATION
    );
    let _token = uuidv4();
    let _object = new this({
        token: _token,
        user: user._id,
        expireDate: expiredAt.getTime()
    });
    let refreshToken = await _object.save();
    return refreshToken.token;
}

RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expireDate.getTime() < new Date().getTime();
}

export default mongoose.model('RefreshToken', RefreshTokenSchema);