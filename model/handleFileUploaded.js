const XLSX = require('xlsx');
const fs = require('fs');

const { excelDateToStringDateFormat, formatDate, convertValuesNumericToString } = require('./utils');
const {
  tobaccosType,
  employeeDetailInfo,
  address,
  phoneNumber,
  reportConfig
} = require('../env');
const { convertHTML2PDF } = require('./generatePDF');

let signatureUrl;

const generateData = (date, employeeInfo) => {
  try {
    const sellInfo = employeeInfo.reduce((pre, cur) => {
      const tobaccoName = cur['Tên nhãn hiệu'].trim();
      pre[tobaccoName].receive = cur['Số lượng nhận'];
      pre[tobaccoName].return = cur['Số lượng trả lại'];
      pre[tobaccoName].sold = cur['Số lượng bán'];
      pre[tobaccoName].total = cur['Thành tiền giá hóa đơn'];
      pre[tobaccoName].price = cur['Giá hóa đơn đã bao gồm VAT'];

      return pre;
    }, Object.keys(tobaccosType).reduce((pre, cur) => {
      pre[cur] = { receive: 0, return: 0, sold: 0, total: 0, price: tobaccosType[cur].price };
      return pre;
    }, {}));

    const employeeName = employeeInfo[0]['Tên nhân viên'];
    signatureUrl = employeeDetailInfo[employeeName].signature;

    return {
      day: date.split('-')[1],
      month: date.split('-')[0],
      year: date.split('-')[2],
      employeeName,
      address,
      phone: phoneNumber,
      employeePhone: employeeDetailInfo[employeeName].phone,
      total: convertValuesNumericToString(Object.keys(sellInfo).reduce((pre, cur) => {
        pre.receive += sellInfo[cur].receive;
        pre.return += sellInfo[cur].return;
        pre.sold += sellInfo[cur].sold;
        pre.total += sellInfo[cur].total;

        return pre;
      }, { receive: 0, return: 0, sold: 0, total: 0 })),
      tobaccos: Object.keys(sellInfo).map((tobacco, index) => ({
        stt: index + 1,
        name: tobacco,
        info: convertValuesNumericToString(sellInfo[tobacco]),
      }))
    }
  } catch (error) {
    console.error('😎 Sylitas | An unexpected error when generating data', error);
    throw error;
  }
}

const generateTemplateHTML = (path = `${__dirname}/paymentReceipt.html`) => {
  let htmlContent = fs.readFileSync(path, "utf8");
  htmlContent = htmlContent.replace('$imgSrc', signatureUrl);
  htmlContent = htmlContent.replace('$fontSize', reportConfig.fontSize);
  htmlContent = htmlContent.replace('$wxh', reportConfig.logoConfig.wxh);
  htmlContent = htmlContent.replace('$spaceLeft', reportConfig.logoConfig.spaceLeft);
  return htmlContent;
}

exports.handleFileUploaded = async (req, res) => {
  const { name: employeeName, date: printDate } = req.body;
  const file = req.file;
  try {
    let workbook;
    try {
      workbook = XLSX.readFile(file.path);
    } catch (error) {
      workbook = XLSX.readFile(`${__dirname}/../uploads/reportMonthly.xlsx`);
    }
    const sheet_name_list = workbook.SheetNames;
    const xlDataArr = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const date = formatDate(printDate);

    const employeeInfo = xlDataArr.filter((xlData) => {
      const xlData_date = excelDateToStringDateFormat(xlData['Ngày'], 'mm-dd-yyyy');
      const xlData_name = xlData['Tên nhân viên'];
      return (xlData_date === date && xlData_name === employeeName)
    });

    // Get the data from Excel file and modify it
    const dataRaw = generateData(date, employeeInfo);
    console.log('😎 Sylitas | Generate data for export PDF successfully');

    console.log('😎 Sylitas | dataRaw : ', dataRaw);

    // Generate HTML as a template
    const template = generateTemplateHTML();
    console.log('😎 Sylitas | Generate template successfully');

    // Convert HTML to PDF
    const outputPath = `${__dirname}/../public/paymentReceipt.pdf`;
    await convertHTML2PDF(template, dataRaw, outputPath);

    console.log('😎 Sylitas | Generate PDF successfully');

    require('child_process').exec('start http://localhost:3000/pdf');

    res.redirect('http://localhost:3000/');
  } catch (error) {
    res.redirect('http://localhost:3000/error');
  }
}
