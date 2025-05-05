const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif','mp4'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// Multer middleware setup with Cloudinary storage and file type validation
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
  limits: { fileSize: 200 * 1024 * 1024 } // 100MB limit for videos
});

module.exports = upload;
