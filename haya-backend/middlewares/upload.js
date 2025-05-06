// ../haya-backend/middlewares/upload.js

import multer from 'multer';
// path is not used in the original ads file, so don't import
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Export a function that takes the 'env' object
export default (env) => {
  try {
    // Configure Cloudinary using the 'env' object passed to this function
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  } catch (e) {
      console.error("Cloudinary config failed in ads upload factory:", e);
      throw new Error("Failed to configure Cloudinary ads middleware");
  }

  // Cloudinary Storage now uses the configured cloudinary instance
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'ads', // Matches the original file's purpose
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

  // Multer middleware setup
  const upload = multer({ storage });

  // Return the configured middleware
  return upload;
};
