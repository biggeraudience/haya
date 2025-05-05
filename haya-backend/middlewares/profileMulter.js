const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration for Profile Photos
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Profile Photos
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_photos', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// Multer middleware setup for profile photo upload
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

module.exports = { uploadPhoto };
