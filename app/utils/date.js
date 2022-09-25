/*
 * @Author: hecz 
 * @Date: 2021-04-14 
 * @Description: 获取日期
 */

// 获取昨天的日期
const getYestoday = (type = 'date', notAddZero) => {
  let date = new Date()
  date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
  let year = date.getFullYear() + ''
  let month = date.getMonth() + 1 + ''
  let day = date.getDate() + ''
  if (!notAddZero) {
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
  }
  let today = year + month + day
  if (type === 'date') {
    today = `${year}-${month}-${day}`
  } else if (type === 'dateTime') {
    let hour = date.getHours();
    let minu = date.getMinutes();
    let sec = date.getSeconds();
    if (!notAddZero) {
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
    }
    today = `${year}-${month}-${day} ${hour}:${minu}:${sec}`
  }
  return today
}

// 获取当前日期
const getToday = (type = 'date', notAddZero) => {
  let date = new Date()
  let year = date.getFullYear() + ''
  let month = date.getMonth() + 1 + ''
  let day = date.getDate() + ''
  if (!notAddZero) {
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
  }
  let today = year + month + day
  if (type === 'date') {
    today = `${year}-${month}-${day}`
  } else if (type === 'dateTime') {
    let hour = date.getHours();
    let minu = date.getMinutes();
    let sec = date.getSeconds();
    if (!notAddZero) {
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
    }
    today = `${year}-${month}-${day} ${hour}:${minu}:${sec}`
  }
  return today
}

const getCountDays = (currentDate = null) => {
  const date = currentDate ? new Date(currentDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  let lastDay = new Date(year, month + 1, 0).getDate();
  let dayList = [];
  for (let i = 0; i < lastDay; i++) {
    const day = i + 1;
    dayList.push(day);
  }
  return dayList
}

/**
 * 日期差计算
 * @description 一天的时间戳 86400000
 * @param { start } 开始日期
 * @param { end } 结束日期 
 * @returns { Number } 日期差结果，当天-当天应该为1天，所以结果加1
 */
const getDateDiff = (start, end) => {
  return ((Date.parse(end) - Date.parse(start)) / 86400000) + 1
}

/**
 * 日期是否在某个时间范围内
 * @param { start } 开始日期
 * @param { end } 结束日期 
 * @param { current } 当前日期
 * @returns { Boolean } 日期差
 */
const dateInRangeProgress = (start, end) => {
  let current = getToday()
  let res = 0
  // 小于时间范围
  if (Date.parse(start) > Date.parse(current)) {
    res = 0
  }
  // 超出时间范围
  if (Date.parse(end) < Date.parse(current)) {
    res = 100
  }
  // 时间范围内
  if (Date.parse(start) <= Date.parse(current) && Date.parse(end) >= Date.parse(current)) {
    let dayTotal = getDateDiff(start, end)
    let currentTotal = getDateDiff(start, current) - 1 // 今日不计算在预计内，不然今日基本都是延期
    res = (currentTotal / dayTotal * 100).toFixed(0)
  }
  return Number(res)
}

/**
 * 获取日期，不要时分秒
 */
const deleteTime = (date) => {
  return date.split(' ')[0]
}

/**
 * 判断时间是否在暂停时间范围内
 */
const inPauseRange = (pauseRangeList, searchDateArr, dayNum) => {
  let day = dayNum < 10 ? '0' + dayNum : dayNum
  // 当前日期
  let date = `${searchDateArr[0]}-${searchDateArr[1]}-${day}`
  let inRange = false
  pauseRangeList.forEach(item => {
    // 暂停了，没有取消暂停，判断是否大于等于该时间
    if (item.length === 1) {
      if (Date.parse(date) >= Date.parse(deleteTime(item[0]))) {
        inRange = true
      }
    }
    // 暂停过，已经取消了暂停，判断是否处于该区间
    else if (Date.parse(date) == Date.parse(deleteTime(item[0])) && Date.parse(date) == Date.parse(deleteTime(item[1]))) {
      inRange = false
    }
    else {
      if (Date.parse(date) >= Date.parse(deleteTime(item[0])) && Date.parse(date) < Date.parse(deleteTime(item[1]))) {
        inRange = true
      }
    }
  })

  return inRange
}

Date.prototype.format = function() {
  let s = '';
  let mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
  let day = this.getDate()>=10?this.getDate():('0'+this.getDate());
  s += this.getFullYear() + '-'; // 获取年份。
  s += mouth + "-"; // 获取月份。
  s += day; // 获取日。
  return (s); // 返回日期。
};

// 获得本周的结束日期
const getWeekDate = ()=> {
  let now = new Date();             // 当前日期
  let nowDayOfWeek = now.getDay();  // 今天本周的第几天
  let nowDay = now.getDate();       // 当前日
  let nowMonth = now.getMonth();    // 当前月
  let nowYear = now.getYear();      // 当前年
  nowYear += (nowYear < 2000) ? 1900 : 0;
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1).format();
  let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek)).format();
  return {
    weekStartDate,
    weekEndDate
  }
}

const getRealDateRange = (start, end) => {
  let ab = start.split("-");
  let ae = end.split("-");
  let db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  let de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  let unixDb = db.getTime();
  let unixDe = de.getTime();
  let list = []
  for (let k = unixDb; k <= unixDe;) {
    let res = (new Date(parseInt(k))).format();
    k = k + 24 * 60 * 60 * 1000;
    res && list.push(res)
  }
  return list
}

module.exports = {
  getToday,
  getCountDays,
  getDateDiff,
  getYestoday,
  dateInRangeProgress,
  inPauseRange,
  getRealDateRange,
  getWeekDate
}