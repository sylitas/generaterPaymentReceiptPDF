const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

router.get('/xlsx.png', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/xlsx.png'));
});

router.get('/logo.png', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/logo.png'));
});

router.get('/signature/duc.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/duc.jpg'));
});

router.get('/signature/hau.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/hau.jpg'));
});

router.get('/signature/hien.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/hien.jpg'));
});

router.get('/signature/khang.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/khang.jpg'));
});

router.get('/signature/long.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/long.jpg'));
});

router.get('/signature/nam.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/nam.jpg'));
});

router.get('/signature/tan.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/tan.jpg'));
});

router.get('/signature/tho.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/tho.jpg'));
});

router.get('/signature/tu.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signature/tu.jpg'));
});

module.exports = router;