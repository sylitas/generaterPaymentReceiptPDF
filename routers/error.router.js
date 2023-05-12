const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/error/index.html'));
});

router.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/error/style.css'));
});

module.exports = router;