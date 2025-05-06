// ../haya-backend/middlewares/profileMulter.js

import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export default (env) => {
  try {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  } catch (e) {
      console.error("Cloudinary config failed in profileMulter factory:", e);
      throw new Error("Failed to configure Cloudinary profile middleware");
  }

  const profilePhotoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'profile_photos',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

  const uploadPhoto = multer({
    storage: profilePhotoStorage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|webp|gif|avif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(cb(new Error('Invalid file type. Only jpeg, jpg, png, webp, gif, and avif files are allowed.'))); // Corrected this line's callback usage
      }
    },
  });

  return { uploadPhoto };
};
