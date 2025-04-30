const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    return res.json({ image_url: req.file.path });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;