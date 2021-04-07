export const baseURL = 'https://business.myxbx.com/'

export const crmURL = '/crmTest'

// 本地连接沙盒环境接口
/* let xkURL = "/sandbox-xk";
let userURL = "/sandbox-user";
let aicURL = "/sandbox-aic";*/

// 本地连线上环境接口
// let xkURL = '/xk'
// let userURL = '/user'
// let aicURL = '/aic'

// 正常配置
let xkURL = '/xkTest'
let userURL = '/userTest'
let aicURL = '/aicTest'

if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_PROD) {
  // 线上环境
  xkURL = '/xk'
  userURL = '/user'
  aicURL = '/aic'
} else if (
  process.env.NODE_ENV === 'production' &&
  process.env.VUE_APP_SANDBOX
) {
  // 沙盒环境
  xkURL = '/sandbox-xk'
  userURL = '/sandbox-user'
  aicURL = '/sandbox-aic'
} else {
  xkURL = '/xkTest'
  userURL = '/userTest'
  aicURL = '/aicTest'
  // xkURL = '/sandbox-xk'
  // userURL = '/sandbox-user'
  // aicURL = '/sandbox-aic'
  // xkURL = '/xk'
  // userURL = '/user'
  // aicURL = '/aic'
}

export {
  xkURL,
  userURL,
  aicURL
}
