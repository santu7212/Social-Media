 // utils/imagekitHelper.js
import fs from "fs";
import { imagekit } from "../configs/imagekit.js";

export const uploadToImageKit = async (file, width) => {
  try {
    const buffer = fs.readFileSync(file.path);

    const response = await imagekit.upload({
      file: buffer, // file buffer
      fileName: file.originalname, // original file name
    });

    // safely delete temp file
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.warn("Failed to delete temp file:", file.path, err.message);
    }

    // return transformed URL
    return imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width },
      ],
    });
  } catch (error) {
    console.error("❌ ImageKit Upload Error:", error.message);
    throw error;
  }
};
