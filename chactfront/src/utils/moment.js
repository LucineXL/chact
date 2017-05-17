/*
 * formatDateToUTC  将日期转为标准格式
 * dateDiff 计算日期相差的天数  传入的格式必须为2016-10-01
 * isNormalNum:       判断是否是大于等于0的数字
 * getWeek:           计算日期为星期几， 参数格式可为 '20160908' 或 '2016.09.08'
 * calculateNights:   计算晚数，参数格式为 ('20160908', '20160920')
 * secondsToDHM:      秒数转为 1d2h3m 格式，1d展示成24h
 * secondsToHour:     秒数转为 1.5h 格式
 * formatStrToTime:   将字符串('20160908') 转换成 时间字符串('2016.09.08')
 * formatStrToDate:   '20160908' => Date格式
 * formatDateToMMDD:   'yyyyMMdd_hh:mm' => '09月08日'
 * formatDateToMMDDHH:   'yyyyMMdd_hh:mm' => '09.08 09:00'
 * formatDateToTime:   'yyyyMMdd_hh:mm' => '09:00'
 * dateToFormatStr:          Date格式 => 'yyyyMMdd'
 * changeToTime:       将从php获取的十位时间戳先转换为13位再转为时间字符串('2016.9.8 01:01')
 * changeToTimeSecond:       将从php获取的十位时间戳先转换为13位再转为时间字符串('2016.9.8 01:01:03')
 * changeToTimeMMDDHHMM:       将从php获取的十位时间戳先转换为13位再转为时间字符串('9.8 01:01')
 * changeToTimeYYMMDD:       将从php获取的十位时间戳先转换为13位再转为时间字符串('2016.9.8')
 * dateWithoutYear:   2015.03.04 => 3.4
 * dateToTime:          'yyyyMMdd_hh:mm' => 'yyyyMMdd'
 * wayToKm:               将没有单位的距离转化为以km为单位的保留一位小数的数字,如果小于一km则直接显示以m为单位的数字(5678 => 5.6km)
 * timeToHourMin        将单位为秒的数字转化成单位为xxhxxmin(3610 => 1h1min),小于一小时直接以min展示
 * forStrToTime                 将字符串('20160908') 转换成 时间字符串('2016.9.8')
 *   forStrToTims                                          将字符串('aaaabbcc')转换成('aaaa年bb月cc日')
 */
export function formatDateToUTC(date) {
  return date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8)
}
export function dateDiff(d1, d2) {
  const stmp = Date.parse(d1);
  const etmp = Date.parse(d2);
  return Math.round((etmp - stmp) / (1000 * 60 * 60 * 24));
}
export const isNormalNum = num => {
  if (num != null && num != "" && num >= 0) {
    return !isNaN(num);
  }
  return false;
}

export const formatStrToTime = (str, space = '.') => {
  if (str) {
    return str.slice(0, 4) +
      space +
      str.slice(4, 6) +
      space +
      str.slice(6, 8);
  } else {
    return str
  }
};

export const dateWithoutYear = str => {
  if (!str) {
    return;
  }
  let arr = str.split('\.').slice(1);
  return arr[0].replace(/^0/, '') + '.' + arr[1].replace(/^0/, '');

}

export const calculateNights = (startD, endD) => { //间隔天数 ( ==晚数 )
  if (!startD || !endD) {
    return '';
  }
  startD = new Date(startD.slice(0, 4) + '-' + startD.slice(4, 6) + '-' + startD.slice(6));
  endD = new Date(endD.slice(0, 4) + '-' + endD.slice(4, 6) + '-' + endD.slice(6));
  return (endD.getTime() - startD.getTime()) / 1000 / 3600 / 24;
}

export const getWeek = str => {
  if (!/\D/.test(str)) {
    str = formatStrToTime(str);
  }
  let weeks = Immutable.List.of('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let week = new Date(str).getDay();
  return weeks.get(week);
}

export const secondsToDHM = (sec, min) => { // seconds: 传入的毫秒值，
  // min: 分钟的展示格式，默认：m
  let result = '';
  const d = sec && Math.floor(sec / 3600 / 24) || 0;
  result += d > 1 ? (d + 'd') : '';
  result += Math.floor(sec / 3600) % 24 > 0 ?
    Math.floor(sec / 3600) % 24 + (d == 1 ? 24 : 0) + 'h' :
    '';
  result += Math.floor(sec / 60) % 60 > 0 ?
    Math.floor(sec / 60) % 60 + (min ? min : result == '' ? 'min' : 'm') :
    '';

  return result;
}

export const secondsToHM = (sec) => {
  let result = '';
  const d = sec && Math.floor(sec / 3600 / 24) || 0;
  result += Math.floor(sec / 3600) % 24 > 0 ?
    Math.floor(sec / 3600) % 24 + (d > 0 ? d * 24 : 0) + 'h' :
    (d >= 1 ? 24 * d + 'h' : '');
  result += Math.floor(sec / 60) % 60 > 0 ?
    Math.floor(sec / 60) % 60 + (result == '' ? 'min' : 'm') :
    '';

  return result;
}

export const formatStrToDate = str => {
  let date = [str.slice(0, 4), str.slice(4, 6), str.slice(6, 8)].join('/');
  return new Date(date);
};

export const secondsToHour = dur => {
  let hours = (dur / (60 * 60));
  if (dur % 3600) {
    hours = hours.toFixed(1);
  }
  return hours + 'h';
};

export const formatDateToMMDD = str => {
  if (str) {
    return str.slice(4, 6) + '月' + str.slice(6, 8) + '日';
  } else {
    return str;
  }
}


export const formatDateToMMDDHH = str => {
  if (str) {
    return str.slice(4, 6) + '.' + str.slice(6, 8) + " " + str.slice(9, 14);
  } else {
    return str;
  }
};

export const formatDateToTime = str => {
  if (str) {
    return str.slice(9, 14);
  } else {
    return str;
  }
};

export const dateToFormatStr = date => {
  let Y = date.getFullYear() + '';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());

  return Y + M + D;
};

export const changeToTime = (data) => {
  let date = new Date(data * 1000);
  let Y = date.getFullYear() + '.';
  let M = (date.getMonth() + 1) + '.';
  let D = date.getDate() + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  return Y + M + D + h + m;
}
export const changeToTimeSecond = (data) => {
  let date = new Date(data * 1000);
  let Y = date.getFullYear() + '.';
  let M = (date.getMonth() + 1) + '.';
  let D = date.getDate() + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}
export const changeToTimeMMDDHHMM = (data) => {
  // let date = new Date(data * 1000);
  let date = new Date(data);
  let M = (date.getMonth() + 1) + '.';
  let D = date.getDate() + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  return M + D + h + m;
}
export const changeToTimeYYMMDD = (data) => {
  let date = new Date(data * 1000);
  let Y = date.getFullYear() + '.';
  let M = (date.getMonth() + 1) + '.';
  let D = date.getDate() + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  return Y + M + D;
}
export const dateToTime = str => {
  if (str) {
    return str.slice(0, 8);
  } else {
    return str;
  }
}

export const wayToKm = num => {
  if (num > 1000 && num % 1000 != 0) {
    let a = (num / 1000);
    let k = a.toFixed(1);
    return k + 'km';
  } else if (num >= 1000 && num % 1000 == 0) {
    let k = (num / 1000);
    return k + 'km';
  } else if (num < 1000) {
    return num + 'm';
  }
}

export const timeToHourMin = (str, showHM = false, needFloor = false) => {
  if (!showHM) {
    if (str >= 3600) {
      let H = parseInt(str / (60 * 60));
      let m = Math.ceil((str - H * 3600) / 60);
      if (needFloor) {
        m = Math.floor((str - H * 3600) / 60);
      }
      let result = m > 0 ? H + 'h' + m + "m" : H + 'h';
      return result
    } else {
      let m = Math.ceil(str / 60);
      if (needFloor) {
        m = Math.floor(str / 60);
      }
      let result = m >= 0 ? m + "min" : '';
      return result
    }
  } else {
    if (str >= 3600) {
      let H = parseInt(str / (60 * 60));
      let m = Math.ceil((str - H * 3600) / 60);
      if (needFloor) {
        m = Math.floor((str - H * 3600) / 60);
      }
      let result = H + 'h' + m + "m";
      return result;
    } else {
      let m = Math.ceil(str / 60);
      if (needFloor) {
        m = Math.floor(str / 60);
      }
      let result = '0h' + m + "m";
      return result
    }
  }
}

export const forStrToTime = (str, space = '.') => {
  if (str) {
    //if (parseInt(str.slice(4, 6)) < 10 && parseInt(str.slice(6, 8)) < 10) {
    //  return str.slice(0, 4) + space + str.slice(5, 6) + space + str.slice(7, 8);
    //} else if (parseInt(str.slice(4, 6)) < 10 && parseInt(str.slice(6, 8)) >= 10) {
    //  return str.slice(0, 4) + space + str.slice(5, 6) + space + str.slice(6, 8);
    //} else if (parseInt(str.slice(4, 6)) >= 10 && parseInt(str.slice(6, 8)) < 10) {
    //  return str.slice(0, 4) + space + str.slice(4, 6) + space + str.slice(7, 8);
    //} else if (parseInt(str.slice(4, 6)) >= 10 && parseInt(str.slice(6, 8)) >= 10) {
    //  return str.slice(0, 4) + space + str.slice(4, 6) + space + str.slice(6, 8);
    //}
    const year = str.slice(0, 4);
    const month = str.slice(4, 5) != 0 ? str.slice(4, 6) : str.slice(5, 6);
    const day = str.slice(6, 7) != 0 ? str.slice(6, 8) : str.slice(7, 8);
    return `${year}.${month}.${day}`
  }
  else {
    return str;
  }
}
export const forStrToOne = str => {
  if(str==0||str==0.0||str==0.00){
    return '';
  }
  if (str && parseFloat(str).toFixed(1) + '0' == parseFloat(str).toFixed(2)) {
    if (str && parseInt(str) + '.' + '0' == parseFloat(str).toFixed(1)) {
      return parseInt(str);
    } else {
      return parseFloat(str).toFixed(1);
    }
  } else if (str && parseFloat(str).toFixed(1) + '0' != parseFloat(str).toFixed(2)) {
    return parseFloat(str).toFixed(2);
  }
}

export const forStrToTims = str => {
  return str.slice(0, 4) + '年' + str.slice(4, 6) + '月' + str.slice(6, 8) + '日';
}
export const forStrToTimes = (str, space = '.') => {
  if (str) {
    if (parseInt(str.slice(4, 6)) < 10 && parseInt(str.slice(6, 8)) < 10) {
      return str.slice(5, 6) + space + str.slice(7, 8);
    } else if (parseInt(str.slice(4, 6)) < 10 && parseInt(str.slice(6, 8)) >= 10) {
      return str.slice(5, 6) + space + str.slice(6, 8);
    } else if (parseInt(str.slice(4, 6)) >= 10 && parseInt(str.slice(6, 8)) < 10) {
      return str.slice(4, 6) + space + str.slice(7, 8);
    } else if (parseInt(str.slice(4, 6)) >= 10 && parseInt(str.slice(6, 8)) >= 10) {
      return str.slice(4, 6) + space + str.slice(6, 8);
    }
  } else {
    return str;
  }
}


export const parseDate=(date)=> {
    if(!date) {
      return null;
    }
    let year = date.slice(0,4);
    let month = getTime(date.slice(4,6));
    let day = getTime(date.slice(6,8));
    return year.concat('.').concat(month).concat('.').concat(day);
}
export const calculateTransferDays=(startDate, endDate)=> {
    let startTime = startDate.getTime()
    let endTime = endDate.getTime()

    let transferTime = parseInt((endTime - startTime)/1000/3600/24);
    return transferTime;
}
function getTime(time) {
    if(time < 10) {
        time = time.slice(1,2);
    }
    return time;
}
export const changeTo = (data) => {
  let date = new Date(data * 1000);
  let Y = date.getFullYear() + '.';
  let M = (date.getMonth() + 1) + '.';
  let D = date.getDate() + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  return M + D + h + m;
}
export const changeToT=str=>{
  if(parseInt(str)>99){
    return str.slice(0,2);
  }else{
    return str;
  }
}
