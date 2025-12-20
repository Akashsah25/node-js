import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

const uploadCloudinary = async (localPath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    if (!localPath) return null;

    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: "image",
    });

    fs.unlink(localPath);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    if (localPath) {
      try {
        fs.unlink(localPath);
      } catch {}
    }

    return null;
  }
};

export { uploadCloudinary };
