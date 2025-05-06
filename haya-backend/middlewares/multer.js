import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Export a function that takes the Worker `env`
export default (env) => {
  cloudinary.config({
    cloud_name:  env.CLOUDINARY_CLOUD_NAME,
    api_key:     env.CLOUDINARY_API_KEY,
    api_secret:  env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'products',
      allowed_formats: ['jpg','jpeg','png','webp','gif','avif','mp4'],
      transformation: [{ quality:'auto', fetch_format:'auto' }],
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const fileTypes  = /jpeg|jpg|png|webp|avif|mp4|mov|avi/;
      const extname    = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype   = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only images and videos are allowed.'));
      }
    },
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  });

  return upload;
};
