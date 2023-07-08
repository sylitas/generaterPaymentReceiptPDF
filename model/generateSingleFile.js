const XLSX = require('xlsx');
const fs = require('fs');

const {
  excelDateToStringDateFormat,
  formatDate,
  convertValuesNumericToString,
  toVietnamese,
} = require('./utils');

const {
  tobaccosType,
  employeeDetailInfo,
  address,
  phoneNumber,
  reportConfig,
  vat,
} = require('../env');
const { convertHTML2PDF } = require('./generatePDF');

const generateData = (date, employeeInfo) => {
  try {
    const sellInfo = employeeInfo.reduce(
      (pre, cur) => {
        const tobaccoName = cur['Tên nhãn hiệu'].trim();
        pre[tobaccoName].receive = cur['Số lượng nhận'] || 0;
        pre[tobaccoName].return = cur['Số lượng trả lại'] || 0;
        pre[tobaccoName].sold = cur['Số lượng bán'] || 0;
        pre[tobaccoName].total = Math.round(cur['Thành tiền giá hóa đơn'] || 0);
        pre[tobaccoName].price = cur[' Giá hóa đơn chưa bao gồm VAT '] || 0;

        return pre;
      },
      tobaccosType.reduce((pre, cur) => {
        pre[cur] = { receive: 0, return: 0, sold: 0, total: 0, price: 0 };
        return pre;
      }, {})
    );

    const employeeName = employeeInfo[0]['Tên nhân viên'];

    const pdfData = {
      day: date.split('-')[1],
      month: date.split('-')[0],
      year: date.split('-')[2],
      employeeName,
      address,
      phone: phoneNumber,
      employeePhone: employeeDetailInfo[employeeName].phone,
      total: Object.keys(sellInfo).reduce(
        (pre, cur) => {
          pre.receive += sellInfo[cur].receive;
          pre.return += sellInfo[cur].return;
          pre.sold += sellInfo[cur].sold;
          pre.total += sellInfo[cur].total;

          return pre;
        },
        { receive: 0, return: 0, sold: 0, total: 0 }
      ),
      tobaccos: Object.keys(sellInfo).map((tobacco, index) => ({
        stt: index + 1,
        name: tobacco,
        info: convertValuesNumericToString(sellInfo[tobacco]),
      })),
    };

    pdfData.taxVAT = Math.round(pdfData.total.total * vat);

    pdfData.totalPay = pdfData.total.total + pdfData.taxVAT;

    const moneyInVietnamese = toVietnamese(pdfData.totalPay);

    if (pdfData.totalPay !== 0) {
      pdfData.inVietnamese =
        moneyInVietnamese.charAt(0).toUpperCase() +
        moneyInVietnamese.slice(1) +
        ' đồng';
    } else {
      pdfData.inVietnamese = 'Không đồng';
    }

    pdfData.taxVAT = pdfData.taxVAT.toLocaleString();
    pdfData.totalPay = pdfData.totalPay.toLocaleString();
    pdfData.total = convertValuesNumericToString(pdfData.total);

    return pdfData;
  } catch (error) {
    console.error(
      '😎 Sylitas | An unexpected error when generating data',
      error
    );
    throw error;
  }
};

const generateTemplateHTML = (path = `${__dirname}/paymentReceipt.html`) => {
  let htmlContent = fs.readFileSync(path, 'utf8');
  htmlContent = htmlContent.replaceAll('$fontSize', reportConfig.fontSize);
  htmlContent = htmlContent.replaceAll('$wxh', reportConfig.logoConfig.wxh);
  htmlContent = htmlContent.replaceAll(
    '$spaceLeft',
    reportConfig.logoConfig.spaceLeft
  );
  htmlContent = htmlContent.replaceAll(
    '$signatureHeigh',
    reportConfig.signatureHeigh
  );
  return htmlContent;
};

exports.generateSingleFile = async (
  file,
  data,
  outputPath = `${__dirname}/../public/paymentReceipt.pdf`
) => {
  const { name: employeeName, date: printDate } = data;
  let workbook;
  try {
    workbook = XLSX.readFile(file.path);
  } catch (error) {
    workbook = XLSX.readFile(`${__dirname}/../uploads/reportMonthly.xlsx`);
  }
  const sheet_name_list = workbook.SheetNames;
  const xlDataArr = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[0]]
  );
  const date = formatDate(printDate);

  const employeeInfo = xlDataArr.filter((xlData) => {
    const xlData_date = excelDateToStringDateFormat(
      xlData['Ngày'],
      'mm-dd-yyyy'
    );
    const xlData_name = xlData['Tên nhân viên'];
    return xlData_date === date && xlData_name === employeeName;
  });

  // Get the data from Excel file and modify it
  const dataRaw = generateData(date, employeeInfo);
  console.log('😎 Sylitas | Generate data for export PDF successfully');

  // Generate HTML as a template
  const template = generateTemplateHTML();
  console.log('😎 Sylitas | Generate template successfully');

  // Convert HTML to PDF
  await convertHTML2PDF(template, dataRaw, outputPath);

  console.log('😎 Sylitas | Generate PDF successfully');
};
