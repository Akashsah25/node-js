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
      return resp.status(401).json(new ApiError(401, "Unauthorized request"));
    }
    const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    const User = await user
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!User) {
      return resp.status(401).json(new ApiError(401, "Invalid access token"));
    }
    req.user = User;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});
export default verifyJWT;
