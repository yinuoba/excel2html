/**
 * 一些常用方法
 * @type {Object}
 */
module.exports = {
  getYMD: function(date) { // 去当前年月日
    date = date || new Date();
    return this.getYear(date) + '' + this.getMonth(date) + this.getDay(date);
  },
  getYear: function(date){
    date = date || new Date();
    return date.getFullYear();
  },
  getMonth: function(date){ // 取当前月
    date = date || new Date();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    return month;
  },
  getDay: function(date){ // 取当前年
    date = date || new Date();
    var day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return day;
  }
};