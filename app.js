var fs = require('fs');
var _ = require('underscore');
var xlsx = require('node-xlsx');
var path = require('path');

var excelPath = 'excel/amountexcel.xlsx';
var baseFolder = path.basename(excelPath, '.xlsx');

// read
var obj = xlsx.parse(excelPath);

var dataArr = obj['worksheets'];
var trArr = [], bgcolor = '', trStr = '';

var getYMD = function(date){
  date = date || new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if(month < 10){
    month = '0' + month;
  }
  if(day < 10){
    day = '0' + day;
  }
  return date.getFullYear() + '' + month + day;
};

// 读取头部文件
var header = fs.readFileSync('tpl/header.html', 'utf8');

// 读取尾部文件
var footer = fs.readFileSync('tpl/footer.html', 'utf8');

// 根据数据和bgcolor创建tr字符串
var createTr = function(dataObj, bgcolor){
  var str = '<tr>\n';
  for (var k = 1; k < dataObj.length; k++) {  // 循环行中的列
    var singleObj = dataObj[k];
    str += '  <td align="center" bgcolor="' + bgcolor + '" style="line-height: 22px; padding:9px 0; color:#333333; font-size:12px;">' + singleObj['value'] + '</td>\n';
  }
  str += '</tr>\n';
  return str;
};

// 删除baseFolder下的所有文件，并创建一个新的baseFolder文件夹
var rmdirSync = (function() {
  function iterator(url, dirs) {
    var stat = fs.statSync(url);
    if (stat.isDirectory()) {
      dirs.unshift(url); //收集目录
      inner(url, dirs);
    } else if (stat.isFile()) {
      fs.unlinkSync(url); //直接删除文件
    }
  }

  function inner(pathname, dirs) {
    var arr = fs.readdirSync(pathname);
    for (var i = 0, el; el = arr[i++];) {
      iterator(pathname + "/" + el, dirs);
    }
  }
  return function(dir, cb) {
    cb = cb || function() {};
    var dirs = [];
    try {
      iterator(dir, dirs);
      for (var i = 0, el; el = dirs[i++];) {
        fs.rmdirSync(el); //一次性删除所有收集到的目录
      }
      cb()
    } catch (e) { //如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
      e.code === "ENOENT" ? cb() : cb(e);
    }
  }
})();

rmdirSync(baseFolder, function(e){
  console.log("删除" + baseFolder + "目录以及子目录成功")
})

// 重新创建baseFolder目录
fs.mkdir(baseFolder, function(){
  console.log("创建" + baseFolder + "目录成功");
});

// 循环html，生成对应用户的html文件（含tr）
for (var i = 0; i < dataArr.length; i++) {  // 循环各个sheet
  var data = dataArr[i]['data'];

  for (var j = 1; j < data.length; j++) { // 循环sheet的行
    if (j % 2 === 0) {
      bgcolor = '#ffffff';
    } else {
      bgcolor = '#d3e6f4';
    }

    var username = data[j][0]['value']; // 数组的第一项就是username

    // 生成本行数据的字符串
    trStr = createTr(data[j], bgcolor);

    // 将本行数据添加到对应用户的html文件中
    fs.appendFileSync(baseFolder + '/' + username + '.html', trStr, 'utf8');
  }
}
// 替换html中的内容，把头尾加上
var files = fs.readdirSync(baseFolder);
files.forEach(function(file){
  var fileData = fs.readFileSync(baseFolder + '/' + file, 'utf8');
  var htmlStr = header + fileData + footer;
  fs.writeFileSync(baseFolder + '/' + file, htmlStr, 'utf8');
});