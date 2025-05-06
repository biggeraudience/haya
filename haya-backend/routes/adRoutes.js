// ../haya-backend/routes/adsRoute.js

// Do NOT require upload middleware here at the top level
// const upload = require('../middlewares/upload');

// Export a function that takes the configured uploadAds middleware as an argument
export default (uploadAds) => {
  const express = require('express'); // Require express inside the factory function
  const router = express.Router();

  const {
    createAd,
    getAllAds,
    updateAd,
    deleteAd,
    deleteAllAds
  } = require('../controllers/adController');


  // Routes - Use the uploadAds middleware passed as an argument
  router.post('/', uploadAds.array('images', 5), createAd);
  router.get('/', getAllAds);
  router.put('/:id', uploadAds.array('images', 5), updateAd);

  // Place the delete-all route BEFORE the delete single route.
  router.delete('/all', deleteAllAds);
  router.delete('/:id', deleteAd);

  return router; // Export the configured router
};
