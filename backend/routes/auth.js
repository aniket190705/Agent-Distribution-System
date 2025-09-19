const express = require('express');
const { loginUser, createAdmin, signupUser } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/create-admin', createAdmin);
router.post('/signup', signupUser);  // Add this line

module.exports = router;
