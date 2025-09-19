const express = require('express');
const { upload, uploadFile, getDistributions } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, upload, uploadFile);
router.get('/distributions', auth, getDistributions);

module.exports = router;
