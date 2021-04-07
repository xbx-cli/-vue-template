// import Cookies from 'js-cookie'

const TokenKey = 'token'
// const hasGetRules = 'hasGetRules'
export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function setPermission(hasGetRules){
  return sessionStorage.setItem('hasGetRules',hasGetRules)
}

export function getPermission(){
  return sessionStorage.getItem('hasGetRules')
}

export function removePermission(){
  return sessionStorage.removeItem('hasGetRules')
}


export function getRoutes() {
  return sessionStorage.getItem('routes')
}

export function setRoutes(routes) {
  return sessionStorage.setItem('routes',routes)
}

export function removeRoutes(){
  return sessionStorage.removeItem('routes')
}