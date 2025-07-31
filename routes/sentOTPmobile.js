const express = require('express');
const router = express.Router();
const CustomerUser = require('../Schema/CustomerUser');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// 1. Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes
    let user = await CustomerUser.findOne({ phone });

    if (!user) {
      user = new CustomerUser({ phone, otp, otpExpiry });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }

    await user.save();

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
  console.error("Twilio Error:", error);
  res.status(500).json({ error: 'Failed to send OTP', details: error.message });
}
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const user = await CustomerUser.findOne({ phone });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({ message: 'Phone number verified' });
  } catch (error) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

module.exports = router;
