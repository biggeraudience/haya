// ../haya-backend/middlewares/profileMulter.js

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
      console.error("Cloudinary config failed in profileMulter factory:", e);
      throw new Error("Failed to configure Cloudinary profile middleware");
  }

  // Cloudinary Storage now uses the configured cloudinary instance
  const profilePhotoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'profile_photos',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

  // Multer middleware setup
  const uploadPhoto = multer({
    storage: profilePhotoStorage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|webp|gif|avif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only jpeg, jpg, png, webp, gif, and avif files are allowed.'));
      }
    },
  });

  // Return the configured middleware
  return { uploadPhoto };
};
