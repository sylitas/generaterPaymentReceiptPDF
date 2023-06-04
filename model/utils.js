/**
 * Converts an Excel date number to a JavaScript Date object.
 * @param {number} date - The Excel date number to be converted.
 * @returns {Date} A JavaScript Date object representing the converted date.
 */
const excelDateToJSDate = (date) => {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

/**
Converts an Excel date number to a string-formatted date based on the provided format.
@param {number} _int - The Excel date number to be converted.
@param {string} _dateFormat - The desired date format. Valid formats are 'yyyy-mm-dd', 'yyyy/mm/dd', 'mm-dd-yyyy', and 'mm/dd/yyyy'.
@returns {string} The string-formatted date based on the specified format.
@throws {Error} Throws an error if the format is not supported.
*/
exports.excelDateToStringDateFormat = (_int, _dateFormat) => {
  if (typeof _int === 'string') {
    const arr = _int.split('/').map(el => {
      if (el.length === 1) return `0${el}`
      return el
    });
    return `${arr[1]}-${arr[2]}-${arr[0]}`;
  };
  //take an excel number and return a string-formatted date
  let jsDate = excelDateToJSDate(_int);
  switch (_dateFormat.toLowerCase()) {
    case 'yyyy-mm-dd':
      return jsDate.getFullYear().toString() + "-" + ("0" + (jsDate.getMonth() + 1).toString()).slice(-2) + "-" + ("0" + jsDate.getDate().toString()).slice(-2);
    case 'yyyy/mm/dd':
      return jsDate.getFullYear().toString() + "/" + ("0" + (jsDate.getMonth() + 1).toString()).slice(-2) + "/" + ("0" + jsDate.getDate().toString()).slice(-2);
    case 'mm-dd-yyyy':
      return ("0" + (jsDate.getMonth() + 1).toString()).slice(-2) + "-" + ("0" + jsDate.getDate().toString()).slice(-2) + '-' + jsDate.getFullYear().toString();
    case 'mm/dd/yyyy':
      return ("0" + (jsDate.getMonth() + 1).toString()).slice(-2) + "/" + ("0" + jsDate.getDate().toString()).slice(-2) + '/' + jsDate.getFullYear().toString();
    default:
      throw new Error("format not matching")
  }
}

exports.formatDate = (date) => {
  const newDate = date.split('-');
  return `${newDate[1]}-${newDate[2]}-${newDate[0]}`
}

/**
 * Converts numeric values in an object to their string representation using locale-specific formatting.
 * @param {Object} numericObj - The object containing numeric values to be converted.
 * @returns {Object} An object with the converted string representations of the numeric values.
 */
exports.convertValuesNumericToString = (numericObj) => {
  return Object.keys(numericObj).reduce(
    (pre, cur) => {
      typeof numericObj[cur] === 'number' ? pre[cur] = numericObj[cur].toLocaleString() : pre[cur] = numericObj[cur];
      return pre;
    }, Object.keys(numericObj).reduce((pre, cur) => {
      pre[cur] = '';
      return pre;
    }, {})
  )
}

/**
 * Converts a number to its Vietnamese representation.
 * @param {number|string} number - The number to be converted. It can be a numeric value or a string representation of a number.
 * @returns {string} The Vietnamese representation of the number.
 */
exports.toVietnamese = (number) => {
  const numbers = {
    dvBlock: '1 nghìn triệu tỷ'.split(' '),
    chuHangDonVi: ('1 một' + ' hai ba bốn năm sáu bảy tám chín').split(' '),
    chuHangChuc: ('lẻ mười' + ' hai ba bốn năm sáu bảy tám chín').split(' '),
    chuHangTram: ('không một' + ' hai ba bốn năm sáu bảy tám chín').split(' ')
  };

  const convert_block_two = (number) => {
    let dv = numbers.chuHangDonVi[number[1]];
    const chuc = numbers.chuHangChuc[number[0]];
    let append = '';

    if (number[0] > 0 && number[1] == 5) {
      dv = 'lăm';
    }

    if (number[0] > 1) {
      append = ' mươi';

      if (number[1] == 1) dv = ' mốt';
    }

    return `${chuc}${append} ${dv}`;
  };

  const convert_block_three = (number) => {
    if (number === '000') return '';

    switch (number.length) {
      case 0:
        return '';
      case 1:
        return numbers.chuHangDonVi[number];
      case 2:
        return convert_block_two(number);
      case 3:
        const chuc_dv = number.slice(1, 3) !== '00' ? convert_block_two(number.slice(1, 3)) : '';
        const tram = `${numbers.chuHangTram[number[0]]} trăm`;
        return `${tram} ${chuc_dv}`;
    }
  };

  const str = parseInt(number) + '';
  const arr = [];
  let index = str.length;
  const result = [];

  if (index === 0 || str === 'NaN') return '';

  while (index >= 0) {
    arr.push(str.substring(index, Math.max(index - 3, 0)));
    index -= 3;
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] !== '' && arr[i] !== '000') {
      result.push(convert_block_three(arr[i]));

      if (numbers.dvBlock[i]) result.push(numbers.dvBlock[i]);
    }
  }

  const rsString = result.join(' ').replace(/[0-9]/g, '').replace(/ +/g, ' ').trim();

  return rsString;
};

exports.convertViToEn = (str) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

  str = str.split(' ').join('_');

  return str;
}
