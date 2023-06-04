const fs = require('fs');
const archiver = require('archiver');
const { employeeDetailInfo } = require('../env');
const { convertViToEn } = require('./utils');

exports.zip = async () => {
  const output = fs.createWriteStream(`${__dirname}/../public/pdf.zip`);
  const archive = archiver('zip');

  output.on('close', function () {
    console.log('😎 Sylitas | Zip successful');
  });

  archive.on('error', function (err) { throw err; });

  archive.pipe(output);

  // append files from a sub-directory, putting its contents at the root of archive
  archive.glob('*.pdf', { cwd: `${__dirname}/../public/pdfs/` });

  archive.finalize();
}

