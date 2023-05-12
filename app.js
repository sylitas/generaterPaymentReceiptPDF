const express = require('express');
const multer = require('multer');

const bodyParser = require('body-parser');

const publicRouter = require('./routers/public.router');
const errorRouter = require('./routers/error.router');
const { handleFileUploaded } = require('./model/handleFileUploaded');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, (__dirname + '/uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, 'reportMonthly.xlsx');
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', publicRouter);

app.get('/error', errorRouter);

app.post('/uploadFile', upload.single('excelFile'), handleFileUploaded);

app.get('/pdf', (req, res) => {
  res.sendFile(__dirname + '/public/paymentReceipt.pdf');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});