import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export default function configureAdsMulter(env) {
  const { v2: cloudinary } = require('cloudinary');

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key:    env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'ads',
      allowed_formats: ['jpg','jpeg','png','webp'],
      transformation: [{ quality:'auto', fetch_format:'auto' }],
    },
  });

  const upload = multer({ storage });
  return upload;
}
