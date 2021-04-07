/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ["admin", "editor"];
  return valid_map.indexOf(str.trim()) >= 0;
}

// 验证手机号
export function checkMobile(str) {
  let re = /^1\d{10}$/;
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
}
// 验证密码
export function validatePassword(rule, value, callback) {
  if (value.length < 1) {
    return callback(new Error("密码不能为空"));
  } else {
    return callback();
  }
}

// <!--验证手机号是否合法-->
export function checkTel(rule, value, callback) {
  if (value === "") {
    return callback(new Error("请输入手机号码"));
  } else if (!checkMobile(value)) {
    return callback(new Error("手机号码不合法"));
  } else {
    return callback();
  }
}
//  <!--验证码是否为空-->
export function checkSmscode(rule, value, callback) {
  if (value === "") {
    return callback(new Error("请输入手机验证码"));
  } else {
    return callback();
  }
}
