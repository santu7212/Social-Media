 import fs from "fs";
import imagekit from "../configs/imagekit";

const uploadToImageKit = async (file, width) => {
  const buffer = fs.readFileSync(file.path);
  const response = await imagekit.upload({
    file: buffer,
    fileName: file.originalname,
  });

  // safely delete temp file
  try {
    fs.unlinkSync(file.path);
  } catch (err) {
    console.warn("Failed to delete temp file:", file.path, err.message);
  }

  return imagekit.url({
    path: response.filePath,
    transformation: [
      { quality: "auto" },
      { format: "webp" },
      { width },
    ],
  });
};

export default uploadToImageKit;
