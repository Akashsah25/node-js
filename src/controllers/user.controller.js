import { user } from "../models/user.model.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ErrorHandler.js";

// ! access token & refresh token

const accessToken_AND_refreshToken = async (userId) => {
  try {
    const userdata = await user.findById(userId);
    const accessToken = userdata.generateAccessToken();
    const refreshToken = userdata.generateRefreshToken();
    userdata.refreshToken = refreshToken;
    await userdata.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went to wrong while generat accesstoken & refreshtoken"
    );
  }
};

// ! register user
const registerUser = asyncHandler(async (req, resp) => {
  const { fullName, userName, email, password } = req.body;

  // ! all fields requirements

  if (
    [email, fullName, userName, password].some((field) => field?.trim() === "")
  ) {
    return resp.status(400).json(new ApiError(400, "All fields are required"));
  }

  // ! check existing users

  const existedUser = await user.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    return resp.status(400).json(new ApiError(400, "User already exists"));
  }

  // ! avatar and coverimage localpath

  console.log("FILES:", req.files);

  const avatarLocalpath = req.files?.avatar?.[0]?.path;
  const coverImageLocalpath = req.files?.coverImage?.[0]?.path;
  if (!avatarLocalpath) {
    return resp.status(400).json(new ApiError(400, "Avatar is required"));
  }

  // ! cloudinary upload

  const avatar = await uploadCloudinary(avatarLocalpath);
  const coverImage = coverImageLocalpath
    ? await uploadCloudinary(coverImageLocalpath)
    : null;

  // ! avatar requirement

  if (!avatar) {
    return resp.status(400).json(new ApiError(400, "Avatar is required"));
  }

  // ! create user in DB

  const NewUser = await user.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  //  ! check user is created

  const createduser = await user
    .findById(NewUser._id)
    .select("-password -refreshToken");
  if (!createduser) {
    return resp.status(400).json(new ApiError(400, "user not created"));
  }
  return resp
    .status(201)
    .json(new Apiresponse(201, createduser, "user registered succesfully"));
});

// ! loging user

const logInUser = asyncHandler(async (req, resp) => {
  const { userName, password, email } = req.body;

  //  !  check username or email exist

  if (!userName && !email) {
    return resp
      .status(400)
      .json(new ApiError(400, "username or email required"));
  }
  const loginuser = await user.findOne({ $or: [{ email }, { userName }] });
  if (!loginuser) {
    return resp
      .status(400)
      .json(new ApiError(400, "username or email do not exist"));
  }

  // !  password validation

  if (!password) {
    return resp.status(400).json(new ApiError(400, "password required"));
  }
  const isvalidpassword = await loginuser.isPasswordCorrect(password);
  if (!isvalidpassword) {
    return resp.status(400).json(new ApiError(400, "invalid password"));
  }

  // ! access token & refresh token

  const { accessToken, refreshToken } = await accessToken_AND_refreshToken(
    loginuser._id
  );
  const logedinuser = await user
    .findById(loginuser._id)
    .select("-password -refreshToken");
  const Option = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(200)
    .cookie("accessToken", accessToken, Option)
    .cookie("refreshToken", refreshToken, Option)
    .json(
      new Apiresponse(
        200,
        { user: logedinuser, accessToken, refreshToken },
        "login succesfully"
      )
    );
});

// ! log out

const logOutUser = asyncHandler(async (req, resp) => {
  await user.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefind } },
    { new: true }
  );
  const Option = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(200)
    .clearcookie("accessToken", accessToken, Option)
    .clearcookie("refreshToken", refreshToken, Option)
    .json(new Apiresponse(200, "logout succesfully"));
});

export { registerUser, logInUser, logOutUser };
