import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("file is uploadedin cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinksync(localfilepath);
    return null;
  }
};

export { uploadCloudinary };
