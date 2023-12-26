import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  const options = {
    secure: true,
    sameSite: 'none'
  }
  return Cookies.set(TokenKey, token, options)
  // 如果放在BC后台就需要
  // const options = {
  //   secure: true,
  //   sameSite: 'none'
  // }
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
