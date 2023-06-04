const express = require('express');
const multer = require('multer');

const bodyParser = require('body-parser');

const publicRouter = require('./routers/public.router');
const errorRouter = require('./routers/error.router');
const { handleExportSingle } = require('./model/handleExportSingle');
const { handleExportAll } = require('./model/handleExportAll');
const { zip } = require('./model/zip');

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

app.post('/uploadFile', upload.single('excelFile'), async (req, res) => {
  try {
    const { name } = req.body;
    switch (name) {
      case 'all':
        await handleExportAll(req, res);
        await zip()
        require('child_process').exec('start http://localhost:3000/pdfs');
        break;
      default:
        await handleExportSingle(req, res);
        require('child_process').exec('start http://localhost:3000/pdf');
        break;
    }
    res.redirect('http://localhost:3000/');
  } catch (error) {
    res.redirect('http://localhost:3000/error');
  }
});

app.get('/pdf', (req, res) => {
  res.sendFile(__dirname + '/public/paymentReceipt.pdf');
});

app.get('/pdfs', (req, res) => {
  res.sendFile(__dirname + '/public/pdf.zip');
});

app.listen(3000, () => {
  console.log('😎 Sylitas | Server is running on port 3000');
});