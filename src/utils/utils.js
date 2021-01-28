/**
 * 简单判断是否都是有效值(不是'' || null || undefined)，如果所有项都是有效值 则返回true
 * @param {...rest} rest 不定数量的参数，可能是各种数据类型的数据
 * @return {boolean} 不定数量的参数，可能是各种数据类型的数据
 */
window.isEffective = function(...rest) {
  if (rest && rest.length > 0) {
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === '' || rest[i] === null || rest[i] === undefined) {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
};

/**
 * 判断对象类型
 * @param {string} type 判断类型(Array, Number...)
 * @param {any} obj 需要判断类型的值
 * @return {boolean} 是否符合预期(符合true/不符合false)
 */
window.checkType = function(type, obj) {
  if (type === 'Date') {
    return (
      window.isEffective(obj) &&
      Object.prototype.toString.call(new Date(obj)) === '[object ' + type + ']' &&
      new Date(obj) !== 'Invalid Date'
    );
  }
  return Object.prototype.toString.call(obj) === '[object ' + type + ']';
};

/* 校验正整数 */
window.checkPosInt = function(rule, value, callback, msg, maxNum, minNum) {
  if (!window.isEffective(value)) {
    callback();
  } else if (!/^\+?[1-9][0-9]*$/.test(value)) {
    callback(new Error(msg || '必须为正整数'));
  } else if (!!minNum && value < minNum) {
    callback(new Error(msg || '必须大于' + minNum));
  } else if (!!maxNum && value > maxNum) {
    callback(new Error(msg || '必须小于' + maxNum));
  } else {
    callback();
  }
};

/* 校验非负整数 */
window.checkNonInt = function(rule, value, callback, msg) {
  if (!window.isEffective(value)) {
    callback();
  } else if (!/^(0|[1-9]\d*)$/.test(value)) {
    callback(new Error(msg || '必须为非负整数'));
  } else {
    callback();
  }
};

/* 校验英文和英文字符 */
window.checkEnglish = function(rule, value, callback) {
  let reg = /^[a-z_A-Z0-9\s-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/;
  if (!window.isEffective(value)) {
    callback();
  } else if (!reg.test(value)) {
    callback('只能填写英文或英文字符');
  } else {
    callback();
  }
};

/* 校验手机号码 */
window.checkMobile = function(rule, value, callback) {
  if (!window.isEffective(value)) {
    callback();
  } else if (!/^1[0-9]{10}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};

/* 检验密码 字母和数字 6-20 */
window.checkPwd = function(rule, value, callback) {
  let reg = /^[a-zA-Z0-9]{6,20}$/;
  if (!reg.test(value)) {
    callback('只能填写6~20位的数字或者字母');
  } else {
    callback();
  }
};

// 检测是不是空数组
window.checkNullArr = function(arr) {
  if (Array.prototype.isPrototypeOf(arr) && arr.length === 0) {
    return true;
  } else {
    return false;
  }
};

// 检测是不是空对象
window.checkNullObj = function(obj) {
  if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
    return true;
  } else {
    return false;
  }
};
