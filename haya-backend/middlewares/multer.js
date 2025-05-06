// ~/haya-backend/middlewares/multer.js
export default (env) => {
  // Defer all requires until runtime
  const multer  = require('multer');
  const path    = require('path');
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
      folder: 'products',
      allowed_formats: ['jpg','jpeg','png','webp','gif','avif','mp4'],
      transformation: [{ quality:'auto', fetch_format:'auto' }],
    },
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      const types = /jpeg|jpg|png|webp|avif|mp4|mov|avi/;
      if (types.test(path.extname(file.originalname).toLowerCase()) && types.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only images & videos allowed'));
      }
    },
    limits: { fileSize: 200 * 1024 * 1024 },
  });
};
