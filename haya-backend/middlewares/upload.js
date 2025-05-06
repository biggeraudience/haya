import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Export a function that takes the Worker `env`
export default (env) => {
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
};
