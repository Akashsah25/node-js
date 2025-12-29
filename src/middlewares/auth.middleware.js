import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { user } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, resp, next) => {
  try {
    const Token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!Token) {
      resp.status(400).json(new ApiError(400, "Unauthorized request"));
    }
    const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    const User = await user
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!User) {
      resp.status(400).json(new ApiError(400, "invalied access token"));
    }
    req.user = User;
    next();
  } catch (error) {
    throw new ApiError(400, error.message || "invalid access token");
  }
});
export default verifyJWT;
