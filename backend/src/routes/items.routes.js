const express = require('express');
const router = express.Router();
const Item = require('../models/item.model');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ isDeleted: false })
      .populate('reportedBy', 'username')
      .populate('claimedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reportedBy', 'username')
      .populate('claimedBy', 'username');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
});

// Create new item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const item = new Item({
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description,
      date: req.body.date,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      reportedBy: req.user.userId
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
});

// Update item
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the owner or admin
    const reportedByStr = item.reportedBy && item.reportedBy.toString ? item.reportedBy.toString() : String(item.reportedBy);
    const userIdStr = req.user.userId && req.user.userId.toString ? req.user.userId.toString() : String(req.user.userId);
    if (reportedByStr !== userIdStr && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If a new image is uploaded, delete the old image file
    let updatedFields = req.body;
    if (req.file) {
      if (item.image && fs.existsSync(path.join(__dirname, '../../', item.image))) {
        fs.unlinkSync(path.join(__dirname, '../../', item.image));
      }
      updatedFields.image = `/uploads/${req.file.filename}`;
    }

    // Ensure contactEmail and contactPhone are updated if provided
    if (req.body.contactEmail) updatedFields.contactEmail = req.body.contactEmail;
    if (req.body.contactPhone) updatedFields.contactPhone = req.body.contactPhone;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

// Delete item (now a soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the owner or admin
    const reportedByStr = item.reportedBy && item.reportedBy.toString ? item.reportedBy.toString() : String(item.reportedBy);
    const userIdStr = req.user.userId && req.user.userId.toString ? req.user.userId.toString() : String(req.user.userId);
    if (reportedByStr !== userIdStr && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Perform soft delete
    item.isDeleted = true;
    item.deletedAt = new Date();
    item.deleteReason = req.body.reason;
    item.deleteDescription = req.body.description;
    
    await item.save();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

module.exports = router; 