// ../haya-backend/middlewares/multer.js

import multer from 'multer';
import path from 'path';
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
      console.error("Cloudinary config failed in product multer factory:", e);
      throw new Error("Failed to configure Cloudinary product middleware");
  }

  // Cloudinary Storage now uses the configured cloudinary instance
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'products', // Matches the original file's purpose
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif','mp4'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

  // Multer middleware setup
  const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp|avif|mp4|mov|avi/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
  });

  // Return the configured middleware
  return upload;
};
