// ~/haya-backend/middlewares/profileMulter.js
export default (env) => {
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
      folder: 'profile_photos',
      allowed_formats: ['jpg','jpeg','png','webp','gif','avif'],
      transformation: [{ quality:'auto', fetch_format:'auto' }],
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const types = /jpeg|jpg|png|webp|gif|avif/;
      if (types.test(path.extname(file.originalname).toLowerCase()) && types.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only images allowed.'));
      }
    },
  }).single('photo');

  return { uploadPhoto: upload };
};
