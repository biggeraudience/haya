const express = require("express");
const { trackEvent } = require("../controllers/trackEventController");
const router = express.Router();

router.post("/track-event", async (req, res, next) => {
    try {
        await trackEvent(req, res);
    } catch (error) {
        next(error); // Forward to error-handling middleware
    }
});

module.exports = router;
