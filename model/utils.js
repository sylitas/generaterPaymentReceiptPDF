const excelDateToJSDate = (date) => {
  //takes a number and return javascript Date object
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
  //TODO: Fix later
  const newDate = date.split('-'); // yyyy/mm/dd
  return `${newDate[1]}-${newDate[2]}-${newDate[0]}` // mm/dd/yyyy
}

exports.convertValuesNumericToString = (numericObj) => {
  console.log('😎 Sylitas | numericObj : ', numericObj);
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