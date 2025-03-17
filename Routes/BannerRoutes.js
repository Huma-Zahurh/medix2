const express = require('express');
const router = express.Router();
const { uploadBanner, getBanner } = require('../Controllers/BannerControllers');

router.post('/upload', uploadBanner);
router.get('/get', getBanner);

module.exports = router;