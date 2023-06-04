const { employeeDetailInfo } = require("../env");
const { generateSingleFile } = require("./generateSingleFile");
const { convertViToEn } = require('./utils');

exports.handleExportAll = async (req, res) => {
  const { date } = req.body;
  const file = req.file;
  await Promise.allSettled(Object.keys(employeeDetailInfo).map(async (employeeName) => {
    await generateSingleFile(file, { date, name: employeeName }, `${__dirname}/../public/pdfs/${convertViToEn(employeeName)}.pdf`);
  }))
} 