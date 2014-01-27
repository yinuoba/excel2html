/**
 * 一些常用方法
 * @type {Object}
 */
module.exports = {
  getYMD: function(date) {  // 去当前年月日
    date = date || new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return date.getFullYear() + '' + month + day;
  }

};