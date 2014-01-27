var fs = require('fs');
var _ = require('underscore');
var xlsx = require('node-xlsx');
var path = require('path');
var util = require('./commonjs/util');
var logger = require('./commonjs/log').logger;
var fsadd = require('./commonjs/fsadd.js');

var excelPath = 'excel/demoexcel.xlsx';
var baseFolder = path.basename(excelPath, '.xlsx');

// 将excel数据解析为json数据
var obj = xlsx.parse(excelPath);
var dataArr = obj['worksheets'];

var trArr = [],
  bgcolor = '',
  trStr = '';

// 添加日志间的间隔
logger.info('--------------------------------------------------');
logger.info('--------------------------------------------------');

// 读取头部文件
var header = fs.readFileSync('tpl/header.html', 'utf8');

// 读取尾部文件
var footer = fs.readFileSync('tpl/footer.html', 'utf8');

// 根据数据和bgcolor创建tr字符串
var createTr = function(dataObj, bgcolor) {
  var str = '<tr>\n';
  for (var k = 1; k < dataObj.length; k++) { // 循环行中的列
    var singleObj = dataObj[k];
    str += '  <td align="center" bgcolor="' + bgcolor + '" style="line-height: 22px; padding:9px 0; color:#333333; font-size:12px;">' + singleObj['value'] + '</td>\n';
  }
  str += '</tr>\n';
  return str;
};

// 删除baseFolder下的所有文件，并创建一个新的baseFolder文件夹
fsadd.rmdirSync(baseFolder, function(err) {
  if(!err){
    logger.info("删除" + baseFolder + "目录以及子目录成功")
  } else {
    logger.error(err);
  }
});

// 重新创建baseFolder目录
fs.mkdirSync(baseFolder);
logger.info("创建" + baseFolder + "目录成功");

// 循环html，生成对应用户的html文件（仅含tr）
for (var i = 0; i < dataArr.length; i++) { // 循环各个sheet
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

// 找出目录下的文件
var files = fs.readdirSync(baseFolder);

// 遍历目录下的所有文件，将头尾模版加入文件中
files.forEach(function(file) {
  var fileData = fs.readFileSync(baseFolder + '/' + file, 'utf8');
  var htmlStr = header + fileData + footer;
  fs.writeFileSync(baseFolder + '/' + file, htmlStr, 'utf8');
  logger.info(baseFolder + '/' + file + ' 文件创建成功');
});