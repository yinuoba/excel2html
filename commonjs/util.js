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
  },
  /**
   * 浮点数相加
   * @param  {[type]} arg1 [description]
   * @param  {[type]} arg2 [description]
   * @return {[type]}      [description]
   */
  dcmAdd: function(arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (this.accMul(arg1, m) + this.accMul(arg2, m)) / m;
  },
  /**
   * 浮点数相减
   * @param  {[type]} arg1 [description]
   * @param  {[type]} arg2 [description]
   * @return {[type]}      [description]
   */
  dcmSub: function(arg1, arg2) {
    return this.dcmAdd(arg1, -arg2);
  },
  /**
   * 乘法函数，用来得到精确的乘法结果，javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
   * @param  {[type]} arg1 [description]
   * @param  {[type]} arg2 [description]
   * @return {[type]}      arg1乘以arg2的精确结果
   */
  accMul: function(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {}
    try {
      m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
  /**
   * 除法函数，用来得到精确的除法结果,javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
   * @param  {[type]} arg1 [description]
   * @param  {[type]} arg2 [description]
   * @return {[type]}      arg1除以arg2的精确结果
   */
  accDiv: function(arg1, arg2) {
    var t1 = 0,
      t2 = 0,
      r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split(".")[1].length
    } catch (e) {}
    with(Math) {
      r1 = Number(arg1.toString().replace(".", ""))
      r2 = Number(arg2.toString().replace(".", ""))
      return (r1 / r2) * pow(10, t2 - t1);
    }
  },
  /**
   * 浮点数取余数,跟据实际中的案例很容易丧失精度，通常做法是同时扩大10000倍，但考虑
   * 跟前有关因此还是采用先转整数再计算
   * @param  {[type]} arg1 [description]
   * @param  {[type]} arg2 [description]
   * @return {[type]}      [description]
   */
  dcmYu: function(arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (this.accMul(arg1, m) % this.accMul(arg2, m)) / m;
  }

};