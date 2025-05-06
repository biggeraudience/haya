// ~/haya-backend/middlewares/upload.js
export default (env) => {
  const multer  = require('multer');
  const cloudinaryModule = require('cloudinary');
  const cloudinary = cloudinaryModule.v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name:  env.CLOUDINARY_CLOUD_NAME,
    api_key:     env.CLOUDINARY_API_KEY,
    api_secret:  env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'ads',
      allowed_formats: ['jpg','jpeg','png','webp'],
      transformation: [{ quality:'auto', fetch_format:'auto' }],
    },
  });

  return multer({ storage });
};
