import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export default function configureProfileMulter(env) {
  const { v2: cloudinary } = require('cloudinary');

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key:    env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'profile_photos',
      allowed_formats: ['jpg','jpeg','png','webp','gif','avif'],
      transformation: [{ quality:'auto', fetch_format:'auto' }],
    },
  });

  // single file under field name "photo"
  const uploadPhoto = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const fileTypes  = /jpeg|jpg|png|webp|gif|avif/;
      const extname    = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype   = fileTypes.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed.'));
      }
    },
  }).single('photo');

  return { uploadPhoto };
}
