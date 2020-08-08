import {Message} from 'element-ui'
/*
 * @Author: white.liu 
 * @Date: 2020-03-30 13:46:47 
 * @Last Modified by: white.liu
 * @Last Modified time: 2020-03-30 14:26:41
 * @todo utils
 */
var timer: any;
/**
 * @public
 * @function
 * @todo 添加cookie
 */
export function addcookie(
  name: string,
  value: string,
  expireHours: number = 10000
) {
  var cookieString = name + '=' + escape(value) + '; path=/';
  //判断是否设置过期时间
  if (expireHours > 0) {
    let date = new Date();
    date.setTime(date.getTime() + expireHours * 3600 * 1000);
    cookieString = cookieString + '; expires=' + date.toUTCString();
  }
  document.cookie = cookieString;
}
/**
 * @public
 * @function
 * @todo 获取cookie
 */
export function getcookie(name:string) {
  var strcookie = document.cookie;
  var arrcookie = strcookie.split("; ");
  for (var i = 0; i < arrcookie.length; i++) {
      var arr = arrcookie[i].split("=");
      if (arr[0] == name) return decodeURIComponent(arr[1]); //增加对特殊字符的解析
  }
  return "";
}
/**
 * @public
 * @function
 * @todo 获取Url中的值
 * @memberof Cain
 * @param {String} name key的名字
 */
export function getUrlParam(name: string) {
  if (isBlank(name)) {
    var url = decodeURI(location.search); // 获取url中"?"符后的字串
    var theRequest: any = {};
    if (url.indexOf('?') !== -1) {
      var str = url.substr(1);
      var strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
    }
    return theRequest;
  } else {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    }
  }
  return null;
}
/**
 * @public
 * @function
 * @todo 对日期进行格式化
 * @memberof Cain
 * @param {Date} date 要格式化的日期
 * @param {String} format 进行格式化的模式字符串
 *     支持的模式字母有：
 *     y:年,
 *     M:年中的月份(1-12),
 *     d:月份中的天(1-31),
 *     h:小时(0-23),
 *     m:分(0-59),
 *     s:秒(0-59),
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 */
export function formatDate(date?: any, format?: string) {
  if (!date) {
    date = new Date();
  }
  if (isBlank(format)) {
    format = 'yyyy-MM-dd hh:mm:ss';
  }

  if (typeof date === 'string') {
    if (date.substring(0, date.lastIndexOf('.')) !== '') {
      date = date.substring(0, date.lastIndexOf('.'));
    }
    date = date.replace(/-/g, '/');
  }

  date = new Date(date);
  var map: any = {
    M: date.getMonth() + 1, // 月份
    d: date.getDate(), // 日
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  // @ts-ignore
  format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
    var v: any = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }

      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }

    return all;
  });

  return format;
}
/**
 * getLastMonth 获取当前月的上一个月
 * @param month
 */
export function getLastMonth(month: string): string {
  let tem: Array<string | number> = [];
  tem = month.split('-');
  if (tem[1] === '1') {
    tem[0] = parseInt(tem[0].toString()) - 1;
    tem[1] = '12';
  } else {
    tem[1] = parseInt(tem[1].toString()) - 1;
  }
  tem[1] = tem[1] > 10 ? tem[1] : '0' + tem[1];
  return `${tem[0]}-${tem[1]}`;
}
/**
 * @public
 * @function
 * @todo  用于搜索时间中,替换时分秒成0:0:0使用
 * @memberof Cain
 * @param {String} date
 */
export function setStartTime(date: any) {
  if (!isBlank(date)) {
    var a = new Date(date);
    a.setHours(0);
    a.setMinutes(0);
    a.setSeconds(0);
    return formatDate(a.getTime(), 'yyyy-MM-dd hh:mm:ss');
  }
  return '';
}
/**
 * @public
 * @function
 * @todo  用于搜索时间中,替换时分秒成23:59:59使用
 * @memberof Cain
 * @param {String} date
 */
export function setEndTime(date: any) {
  if (!isBlank(date)) {
    var a = new Date(date);
    a.setHours(23);
    a.setMinutes(59);
    a.setSeconds(59);
    return formatDate(a.getTime(), 'yyyy-MM-dd hh:mm:ss');
  }
  return '';
}
/**
 * @public
 * @function
 * @todo  周计算
 * @memberof Cain
 * @param {String} date
 */
// export function getWeek(date: any) {}
/**
 * @public
 * @function
 * @todo 判断是否为空
 * @memberof Cain
 * @param {Object} obj 需要校验对象
 */
export function isBlank(obj: any) {
  if (
    typeof obj === 'undefined' ||
    obj === undefined ||
    obj == null ||
    obj === 'null' ||
    obj + '' === 'NaN' ||
    obj === 'undefined' ||
    obj === '' ||
    obj.length === 0
  ) {
    return true;
  } else if (typeof obj === 'object' && obj.length === undefined) {
    for (var name in obj) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}
/**
 * @public
 * @function
 * @todo 生日转换为年龄
 * @memberof Cain
 * @param {String} birthday 日期格式为"2000-01-01"
 */
export function brithdayConAges(strBirthday: string) {
  if (!strBirthday) {
    return 0;
  }

  var returnAge;
  var strBirthdayArr: any = strBirthday.split('-');
  var birthYear: any = strBirthdayArr[0];
  var birthMonth: any = strBirthdayArr[1];
  var birthDay: any = strBirthdayArr[2];
  var d: any = new Date();
  var nowYear: any = d.getFullYear();
  var nowMonth: any = d.getMonth() + 1;
  var nowDay: any = d.getDate();

  if (nowYear === birthYear) {
    returnAge = 0; // 同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear; // 年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        var dayDiff = nowDay - birthDay; // 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        var monthDiff = nowMonth - birthMonth; // 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1; // 返回-1 表示出生日期输入错误 晚于今天
    }
  }

  return returnAge; // 返回周岁年龄
}

/**
 * @todo 防抖
 * @Description:
 * @author white liu
 * @date 2019/4/24
 */
export function debounce(fn: Function, wait: number): any {
  return function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, arguments);
      timer = null;
    }, wait);
  };
}
/**
 * @todo 节流
 * @Description:
 * @author white liu
 * @date 2019/4/24
 */
export function throttle(fn: Function, wait: number): any {
  return function() {
    if (timer) return false;
    timer = setTimeout(function() {
      // console.log(timer);
      timer = null;
      // @ts-ignore
      fn.apply(this, arguments);
      clearTimeout(timer);
      // console.log(timer);
    }, wait);
  };
}
/**
 * @todo
 * @Description: 浮点减法计算
 * @author white liu
 * @date 2019/9/9
 * @param 连个数字
 */
export function floatSub(arg1: number, arg2: number) {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/**
 * @todo
 * @Description: 隐藏页面
 * @author white liu
 * @date 2019/9/9
 * @param
 */
export function hidePage() {
  let Dom: any = document.body;
  Dom.style.opacity = 0;
}
export function showPage() {
  let Dom: any = document.body;
  Dom.style.opacity = 1;
}
/**
 * @todo 请求回调处理
 * @Description:
 * @author white liu
 * @date 2019/4/23
 * @param res Object 返回信息
 * @param secFunction function 回调方法
 */
type typeRes = {errorCode:string,errorMsg:string}
export function setRes (res:typeRes, secFunction:(res:typeRes) =>void) {
  if (res.errorCode === '0') {
    secFunction(res)
  } else {
    Message.error(res.errorMsg)
  }
}
