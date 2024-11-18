require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyCaptcha } = require('../controllers/captchaController');

// Use the verifyCaptcha controller for CAPTCHA verification
router.post('/', verifyCaptcha);

router.post('/verify-captcha', async (req, res) => {
  const { captchaToken } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  if (!captchaToken) {
    return res.status(400).json({
      success: false,
      message: 'Captcha token is missing',
    });
  }

  try {
    const response = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    });

    const data = response.data;
    if (data.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed',
        errors: data['error-codes'],
      });
    }
  } catch (error) {
    console.error('Captcha verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during CAPTCHA verification',
      error: error.message,
    });
  }
});

module.exports = router;
