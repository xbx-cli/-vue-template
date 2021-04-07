// 时间戳转日期
export function formatDate(date, format) {
  var time;
  if (!date) return "";
  if (typeof date === "string") {
    time = new Date(
      date
        .replace(/-/g, "/")
        .replace(/T|Z/g, " ")
        .trim()
    );
  } else if (typeof date === "object") {
    time = new Date(date);
  }
  var o = {
    "M+": time.getMonth() + 1, //月份
    "d+": time.getDate(), //日
    "h+": time.getHours(), //小时
    "m+": time.getMinutes(), //分
    "s+": time.getSeconds(), //秒
    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
    S: time.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (time.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return format;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

export function getDefaultDate_Year(e) {
  ////页面进来默认是今年
  let startTime = new Date(new Date(new Date().setMonth(0)).setDate(1));
  let endTime = new Date();
  return [startTime, endTime];
}

//获取两个日期之间相差的天数
export const getDaysBetween = (dateString1, dateString2) => {
  var startDate = Date.parse(dateString1);
  var endDate = Date.parse(dateString2);
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
  // alert(days);
  return days;
};
