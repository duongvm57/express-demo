import User from "../models/user.js";
import RefreshToken from "../models/refreshToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  async signup(params) {
    const existedUser = await User.findOne({ email: params.email });
    if (existedUser) {
      throw new Error('User already exists');
    }

    const encryptedPassword = bcrypt.hashSync(params.password, 8);
    const user = new User({
      name: params.name,
      email: params.email,
      gender: params.gender,
      password: encryptedPassword
    });

    const savedUser = await user.save();

    const accessToken = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400
      }
    );

    return {
      user: savedUser,
      token: accessToken
    };
  }

  async login(params) {
    const user = await User.findOne({ email: params.email });
    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = bcrypt.compareSync(params.password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: process.env.ACESS_TOKEN_EXPIRATION
      }
    );

    const refreshToken = await RefreshToken.createToken(user);

    return {
      username: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  async refreshToken(params) {
    if (!params.refreshToken) {
      throw new Error('Refresh token is required!');
    }
    const refreshToken = await RefreshToken.findOne({ token: params.refreshToken });
    if (!refreshToken) {
      throw new Error('Refresh token not valid!');
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      throw new Error('Refresh token was expired!');
    }
    const newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: process.env.ACESS_TOKEN_EXPIRATION
      }
    );

    return {
      accessToken: newAccessToken,
      refreshToken: {
        token: refreshToken.token,
        expireDate: refreshToken.expireDate
      }
    }
  }
}

export default new AuthService();
