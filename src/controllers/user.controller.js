import { user } from "../models/user.model.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ErrorHandler.js";

const registerUser = asyncHandler(async (req, resp) => {
  const { fullName, userName, email, password } = req.body;

  // ? for all fields requirements

  if (
    [email, fullName, userName, password].some((field) => field?.trim() === "")
  ) {
    return resp.status(400).json(new ApiError(400, "All fields are required"));
  }

  // ? for check existing users

  const existedUser = await user.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    return resp.status(400).json(new ApiError(400, "User already exists"));
  }

  // ? for avatar and coverimage localpath
  console.log("FILES:", req.files);

  const avatarLocalpath = req.files?.avatar?.[0]?.path;
  const coverImageLocalpath = req.files?.coverImage?.[0]?.path;
  if (!avatarLocalpath) {
    return resp.status(400).json(new ApiError(400, "Avatar is required"));
  }

  // ? for cloudinary upload

  const avatar = await uploadCloudinary(avatarLocalpath);
  const coverImage = coverImageLocalpath
    ? await uploadCloudinary(coverImageLocalpath)
    : null;

  // ? for avatar requirement

  if (!avatar) {
    return resp.status(400).json(new ApiError(400, "Avatar is required"));
  }

  // ? for create user in DB
  const User = await user.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });
  //  ? for check that user is created

  const createduser = await user
    .findById(User._id)
    .select("-password -refreshToken");
  if (!createduser) {
    return resp.status(400).json(new ApiError(400, "user not created"));
  }
  return resp
    .status(201)
    .json(new Apiresponse(201, createduser, "user registered succesfully"));
});

export { registerUser };
