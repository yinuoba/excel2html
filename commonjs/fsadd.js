var fs = require('fs');
/**
 * 同步删除目录及目录下的所有文件
 * @return {[type]} [description]
 */
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

module.exports = {
  rmdirSync: rmdirSync
};