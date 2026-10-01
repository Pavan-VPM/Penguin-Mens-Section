import express from 'express';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/**
 * @desc Upload single garment photo
 * @route POST /api/upload
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc Upload multiple garment photos
 * @route POST /api/upload/multiple
 */
router.post('/multiple', upload.array('images', 6), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const urls = req.files.map((file) => `${protocol}://${host}/uploads/${file.filename}`);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      urls: urls,
    });
  } catch (error) {
    console.error('Multiple Image Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
