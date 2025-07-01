const express = require('express');
const router = express.Router();

// Placeholder chat endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Chat route is working!' });
});

module.exports = router; 