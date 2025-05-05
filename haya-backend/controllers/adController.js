const Ad = require('../models/Ads');
const cloudinary = require('cloudinary').v2;

// Upload an Ad
exports.createAd = async (req, res) => {
  try {
    // Log the form fields
    console.log("Request body:", req.body);
    
    const { title, description, category } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Upload images to Cloudinary
    const imageUploads = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: 'ads' })
    );

    const uploadedImages = await Promise.all(imageUploads);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // Save ad in database (including category)
    const newAd = await Ad.create({ title, description, category, images: imageUrls });
    res.status(201).json(newAd);
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get all Ads
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Update an Ad
exports.updateAd = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    let updateData = { title, description };

    if (req.files && req.files.length > 0) {
      const imageUploads = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: 'ads' })
      );
      const uploadedImages = await Promise.all(imageUploads);
      updateData.images = uploadedImages.map((img) => img.secure_url);
    }

    const updatedAd = await Ad.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.status(200).json(updatedAd);
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete an Ad
exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findById(id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Delete associated images from Cloudinary
    await Promise.all(ad.images.map((imageUrl) => {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      return cloudinary.uploader.destroy(`ads/${publicId}`);
    }));

    await Ad.findByIdAndDelete(id);
    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteAllAds = async (req, res) => {
  try {
    // Find all ads in the database
    const ads = await Ad.find();

    // Delete each ad's images from Cloudinary
    await Promise.all(
      ads.map(ad =>
        Promise.all(
          ad.images.map(async (imageUrl) => {
            try {
              // Extract public ID from the URL.
              // Example URL: https://res.cloudinary.com/dwk5eorvm/image/upload/v1740427428/ads/ru90mcimlwm8ngpmjpyd.jpg
              const urlParts = imageUrl.split('/');
              const lastPart = urlParts.pop(); // e.g. "ru90mcimlwm8ngpmjpyd.jpg"
              const publicId = lastPart.split('.')[0]; // e.g. "ru90mcimlwm8ngpmjpyd"

              // Attempt to delete the image
              const result = await cloudinary.uploader.destroy(`ads/${publicId}`);
              if (result.result !== "ok" && result.result !== "not found") {
                console.error(`Error deleting image ${imageUrl}:`, result);
              }
            } catch (err) {
              console.error(`Exception deleting image ${imageUrl}:`, err);
            }
          })
        )
      )
    );

    // Delete all ads from the database
    await Ad.deleteMany({});
    res.status(200).json({ message: 'All ads deleted successfully' });
  } catch (error) {
    console.error('Error deleting all ads:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
